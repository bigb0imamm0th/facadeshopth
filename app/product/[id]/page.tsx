import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products, formatPrice, findProductById, Product, mergeProductWithInventory } from '@/lib/products';
import { getInventory } from '@/lib/inventory';
import { SizeSelector } from '@/components/product/SizeSelector';

type Params = { params: { id: string } };

export function generateStaticParams() {
	return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: Params) {
	const product = findProductById(params.id);
	if (!product) return notFound();
	
	// Get inventory data from Firestore
	let productWithInventory: Product = product;
	try {
		const inventory = await getInventory(params.id);
		if (inventory) {
			productWithInventory = mergeProductWithInventory(product, inventory);
		}
	} catch (error) {
		console.error('Error fetching inventory:', error);
		// Continue with product without inventory
	}

	return (
		<div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 24 }}>
			<div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1' }}>
				<Image
					src={product.image}
					alt={product.name}
					fill
					style={{ objectFit: 'cover', borderRadius: 12 }}
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			</div>
			<div>
				<h1 style={{ marginTop: 0 }}>{productWithInventory.name}</h1>
				<p style={{ color: 'var(--muted)' }}>{productWithInventory.description}</p>
				<p style={{ fontSize: 22, fontWeight: 700 }}>{formatPrice(productWithInventory.price)}</p>
				{productWithInventory.stock !== undefined && (
					<p style={{ 
						fontSize: 14, 
						color: productWithInventory.inStock ? '#666' : '#ef4444',
						marginBottom: '1rem'
					}}>
						{productWithInventory.inStock ? `Stock: ${productWithInventory.stock}` : 'Out of Stock'}
					</p>
				)}
				<SizeSelector product={productWithInventory} />
			</div>
		</div>
	);
}


