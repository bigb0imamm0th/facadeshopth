import { getFirestoreInstance } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

export type InventoryData = {
	productId: string; // document ID
	name: string;
	image: string;
	price: number; // in satang
	tags: string[]; // array of tags like ["tshirt"]
	stock: number; // stock count
	inStock: boolean; // true if in stock, false if out of stock
};

/**
 * Get inventory for a specific product
 */
export async function getInventory(productId: string): Promise<InventoryData | null> {
	try {
		const db = getFirestoreInstance();
		const docRef = doc(db, 'inventory', productId);
		const docSnap = await getDoc(docRef);
		
		if (docSnap.exists()) {
			const data = docSnap.data() as Partial<InventoryData>;
			return {
				productId: productId,
				name: data.name ?? '',
				image: data.image ?? '',
				price: data.price ?? 0,
				tags: data.tags ?? [],
				stock: data.stock ?? 0,
				inStock: data.inStock ?? false
			};
		}
		return null;
	} catch (error) {
		console.error('Error getting inventory:', error);
		throw new Error('Failed to get inventory');
	}
}

/**
 * Get all inventory items
 */
export async function getAllInventory(): Promise<InventoryData[]> {
	try {
		const db = getFirestoreInstance();
		const inventoryCollection = collection(db, 'inventory');
		const querySnapshot = await getDocs(inventoryCollection);
		
		return querySnapshot.docs.map((docSnap) => {
			const data = docSnap.data() as Partial<InventoryData>;
			return {
				productId: docSnap.id,
				name: data.name ?? '',
				image: data.image ?? '',
				price: data.price ?? 0,
				tags: data.tags ?? [],
				stock: data.stock ?? 0,
				inStock: data.inStock ?? false
			};
		});
	} catch (error) {
		console.error('Error getting all inventory:', error);
		throw new Error('Failed to get inventory');
	}
}

/**
 * Create or update inventory for a product
 */
export async function saveInventory(inventoryData: InventoryData): Promise<void> {
	try {
		const db = getFirestoreInstance();
		const docRef = doc(db, 'inventory', inventoryData.productId);
		await setDoc(docRef, inventoryData, { merge: true });
	} catch (error) {
		console.error('Error saving inventory:', error);
		throw new Error('Failed to save inventory');
	}
}

/**
 * Update stock count for a product
 */
export async function updateStock(productId: string, stock: number, inStock: boolean): Promise<void> {
	try {
		const db = getFirestoreInstance();
		const docRef = doc(db, 'inventory', productId);
		await updateDoc(docRef, {
			stock,
			inStock
		});
	} catch (error) {
		console.error('Error updating stock:', error);
		throw new Error('Failed to update stock');
	}
}

