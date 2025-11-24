import { NextResponse } from 'next/server';
import { products, mergeProductWithInventory } from '@/lib/products';
import { getAllInventory } from '@/lib/inventory';

export async function GET() {
	try {
		// Get all inventory from Firestore
		const inventoryList = await getAllInventory();
		
		// Create a map of inventory by productId for quick lookup
		const inventoryMap = new Map(
			inventoryList.map((inv) => [inv.productId, inv])
		);
		
		// Merge products with their inventory data
		const productsWithInventory = products.map((product) => {
			const inventory = inventoryMap.get(product.id);
			return mergeProductWithInventory(product, inventory ?? null);
		});
		
		return NextResponse.json(productsWithInventory);
	} catch (error) {
		// If Firestore fails, return products without inventory
		console.error('Error fetching inventory, returning products without inventory:', error);
		return NextResponse.json(products);
	}
}

