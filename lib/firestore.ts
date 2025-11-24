import { getFirestoreInstance } from './firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export type OrderData = {
	customerEmail: string;
	customerName: string;
	phone?: string;
	address?: string;
	country?: string;
	province?: string;
	postalCode?: string;
	paymentSlipUrl?: string;
	items: Array<{
		productId: string;
		name: string;
		price: number;
		quantity: number;
		size: string;
	}>;
	total: number;
	createdAt?: Timestamp;
	status?: 'pending' | 'confirmed' | 'shipped' | 'delivered';
};

export async function saveOrderToFirestore(orderData: OrderData): Promise<string> {
	try {
		const db = getFirestoreInstance();
		const ordersCollection = collection(db, 'orders');
		
		// Prepare order data (exclude createdAt from spread since we use serverTimestamp)
		const { createdAt, ...orderWithoutTimestamp } = orderData;
		
		const orderWithTimestamp = {
			...orderWithoutTimestamp,
			createdAt: serverTimestamp(),
			status: 'pending' as const
		};

		const docRef = await addDoc(ordersCollection, orderWithTimestamp);
		return docRef.id;
	} catch (error) {
		// If Firebase is not configured, we'll handle it gracefully in the API
		if (error instanceof Error && error.message.includes('Firebase configuration')) {
			throw error;
		}
		console.error('Error saving order to Firestore:', error);
		throw new Error('Failed to save order to database');
	}
}

