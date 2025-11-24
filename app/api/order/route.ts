import { NextRequest, NextResponse } from 'next/server';
import { saveOrderToFirestore } from '@/lib/firestore';
import { getInventory, updateStock } from '@/lib/inventory';
import { findProductById, formatPrice } from '@/lib/products';
import { uploadPaymentSlip } from '@/lib/cloudinary';

type OrderItem = {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	size: string;
};

type OrderPayload = {
	customerEmail: string;
	customerName: string;
	country?: string;
	province?: string;
	postalCode?: string;
	items: OrderItem[];
	total: number;
};

async function sendEmailJS(templateId: string, templateParams: Record<string, unknown>) {
	const serviceId = process.env.EMAILJS_SERVICE_ID;
	const publicKey = process.env.EMAILJS_PUBLIC_KEY;
	const privateKey = process.env.EMAILJS_PRIVATE_KEY;

	if (!serviceId || !publicKey || !privateKey) {
		throw new Error('EmailJS configuration missing');
	}

	console.log('EmailJS credentials detected', {
		serviceId,
		publicKey: publicKey ? '***' : 'missing',
		privateKey: privateKey ? '***' : 'missing'
	});

	const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			service_id: serviceId,
			template_id: templateId,
			user_id: publicKey,
			accessToken: privateKey,
			template_params: templateParams
		})
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		throw new Error(`EmailJS error: ${response.status} ${text}`);
	}
}

export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/order invoked');
		const formData = await request.formData();
		
		const customerEmail = formData.get('customerEmail') as string;
		const customerName = formData.get('customerName') as string;
		const phone = formData.get('phone') as string | null;
		const address = formData.get('address') as string | null;
		const country = formData.get('country') as string | null;
		const province = formData.get('province') as string | null;
		const postalCode = formData.get('postalCode') as string | null;
		const itemsStr = formData.get('items') as string;
		const totalStr = formData.get('total') as string;
		const paymentSlip = formData.get('paymentSlip') as File | null;

		// Validate required fields
		if (!customerEmail || !customerName || !itemsStr || !totalStr) {
			return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
		}

		const items = JSON.parse(itemsStr) as OrderItem[];
		const total = parseInt(totalStr, 10);

		if (!Array.isArray(items) || typeof total !== 'number') {
			return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
		}

		// Handle payment slip file if provided (upload to Cloudinary)
		let paymentSlipUrl: string | undefined;
		if (paymentSlip && paymentSlip.size > 0) {
			const buffer = Buffer.from(await paymentSlip.arrayBuffer());
			try {
				paymentSlipUrl = await uploadPaymentSlip(buffer, paymentSlip.type, `order-${Date.now()}`);
			} catch (uploadError) {
				console.error('Cloudinary upload failed', uploadError);
			}
		}

		// Format items for email
		const lineItems = items
			.map((i) => `${i.name} (Size: ${i.size}) x ${i.quantity} — ${(i.price / 100).toFixed(2)} THB`)
			.join('\n');

		const orderTotal = `${(total / 100).toFixed(2)} THB`;

		const orderItemsForTemplate = items.map((item) => {
			const product = findProductById(item.productId);
			const imageSrc = product?.emailImage || (product?.image ? `${siteUrl}${product.image}` : '');
			return {
				name: item.name,
				size: item.size,
				units: item.quantity,
				price: formatPrice(item.price * item.quantity),
				image_url: imageSrc
			};
		});

		const shippingCost = formatPrice(0);
		const taxCost = formatPrice(0);
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://facade.com';

		// Save to Firestore (optional - continues even if it fails)
		let orderId: string = `temp-${Date.now()}`;
		try {
			orderId = await saveOrderToFirestore({
				customerEmail,
				customerName,
				phone: phone || undefined,
				address: address || undefined,
				country: country || undefined,
				province: province || undefined,
				postalCode: postalCode || undefined,
				paymentSlipUrl,
				items,
				total
			});
		} catch (firestoreError) {
			// Log but don't fail - emails will still be sent
			console.warn('Firestore save failed (continuing with emails):', firestoreError instanceof Error ? firestoreError.message : 'Unknown error');
		}

		// Update inventory for each item in the order
		try {
			for (const item of items) {
				const inventory = await getInventory(item.productId);
				if (inventory) {
					const newStock = Math.max(0, inventory.stock - item.quantity);
					const newInStock = newStock > 0;
					await updateStock(item.productId, newStock, newInStock);
				}
			}
		} catch (inventoryError) {
			// Log but don't fail the order - inventory update is secondary
			console.warn('Inventory update failed (order still processed):', inventoryError instanceof Error ? inventoryError.message : 'Unknown error');
		}

		// Format full address for email
		const addressParts = [];
		if (address) addressParts.push(address);
		if (province) addressParts.push(province);
		if (postalCode) addressParts.push(postalCode);
		if (country) addressParts.push(country);
		const fullAddress = addressParts.join(', ') || 'Not provided';

		// Send customer confirmation email
		const customerTemplateId = process.env.EMAILJS_CUSTOMER_TEMPLATE_ID;
		if (customerTemplateId) {
			await sendEmailJS(customerTemplateId, {
				email: customerEmail,
				to_email: customerEmail,
				to_name: customerName,
				customer_email: customerEmail,
				customer_name: customerName,
				customer_phone: phone || 'Not provided',
				customer_address: fullAddress,
				order_lines: lineItems,
				orders: orderItemsForTemplate,
				shipping: shippingCost,
				tax: taxCost,
				order_total: orderTotal,
				order_id: orderId,
				payment_slip: paymentSlipUrl || '',
				website_link: siteUrl
			});
		}

		// Send shop notification email
		const shopTemplateId = process.env.EMAILJS_SHOP_TEMPLATE_ID;
		if (shopTemplateId) {
			await sendEmailJS(shopTemplateId, {
				email: process.env.SHOP_EMAIL || '',
				to_email: process.env.SHOP_EMAIL || '',
				to_name: 'Facade Shop',
				shop_email: process.env.SHOP_EMAIL || '',
				customer_email: customerEmail,
				customer_name: customerName,
				customer_phone: phone || 'Not provided',
				customer_address: fullAddress,
				order_lines: lineItems,
				orders: orderItemsForTemplate,
				shipping: shippingCost,
				tax: taxCost,
				order_total: orderTotal,
				order_id: orderId,
				payment_slip: paymentSlipUrl || '',
				website_link: siteUrl
			});
		}

		return NextResponse.json({ ok: true, orderId });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Order processing failed';
		console.error('Order error:', error);
		return NextResponse.json({ error: message }, { status: 500 });
	}
}


