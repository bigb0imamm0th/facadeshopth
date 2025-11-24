import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadPaymentSlip(fileBuffer: Buffer, mimeType: string, orderId: string) {
	if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
		throw new Error('Cloudinary configuration missing');
	}

	const encoded = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

	const result: UploadApiResponse = await cloudinary.uploader.upload(encoded, {
		folder: 'payment-slips',
		public_id: `${orderId}-${Date.now()}`,
		resource_type: 'image'
	});

	return result.secure_url;
}


