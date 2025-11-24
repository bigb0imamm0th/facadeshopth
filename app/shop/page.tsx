import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/products';
import styles from './shop.module.css';

async function getProducts(): Promise<Product[]> {
	try {
		// Directly fetch from Firestore in server component
		const { products } = await import('@/lib/products');
		const { mergeProductWithInventory } = await import('@/lib/products');
		const { getAllInventory: getInventory } = await import('@/lib/inventory');
		
		const inventoryList = await getInventory();
		const inventoryMap = new Map(
			inventoryList.map((inv) => [inv.productId, inv])
		);
		
		return products.map((product) => {
			const inventory = inventoryMap.get(product.id);
			return mergeProductWithInventory(product, inventory ?? null);
		});
	} catch (error) {
		console.error('Error fetching products with inventory:', error);
		// Fallback to static products if Firestore fails
		const { products } = await import('@/lib/products');
		return products;
	}
}

export default async function ShopPage() {
	const products = await getProducts();
	
	return (
		<div className={styles.shopContainer}>
			<div className={styles.shopHeader}>
				<h1 className={styles.shopTitle}>Shop</h1>
			</div>
			<div className={styles.productsGrid}>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}

