export type Product = {
	id: string;
	name: string;
	description: string;
	price: number; // satang
	image: string;
	emailImage?: string;
	stock?: number; // from Firestore inventory
	inStock?: boolean; // from Firestore inventory
	tags?: string[]; // from Firestore inventory
};

export const products: Product[] = [
	{
		id: 'id001',
		name: 'The minturn Pavilion st. Luke \'s hospital new York city',
		description: 'Premium cotton t‑shirt with minimal branding.',
		price: 35000,
		image: '/images/productimages/facade-clothing/1.png',
		emailImage: 'https://i.postimg.cc/9QTZnnmJ/1.png'
	},
	{
		id: 'id002',
		name: 'Eiffel Tower & Cafe on Boulevard de La Tour Maubourg, Paris, France',
		description: 'Low profile cap, adjustable strap.',
		price: 35000,
		image: '/images/productimages/facade-clothing/2.png',
		emailImage: 'https://i.postimg.cc/CxDkQQMY/2.png'
	},
	{
		id: 'id003',
		name: 'Parisian building located on the Rue du Cloître Notre-Dame in Paris.',
		description: 'Heavy canvas tote for daily carry.',
		price: 35000,
		image: '/images/productimages/facade-clothing/3.png',
		emailImage: 'https://i.postimg.cc/cLYwbb1d/3.png'
	},
	{
		id: 'id004',
		name: 'Beehive Hotel Ballarat, Victoria, Australia.',
		description: 'Comfortable pullover hoodie with minimal design.',
		price: 35000,
		image: '/images/productimages/facade-clothing/4.png',
		emailImage: 'https://i.postimg.cc/nh7BPPVp/4.png'
	},
	{
		id: 'id005',
		name: 'Tempietto di San Pietro in Montorio in Rome, Italy.',
		description: 'Classic fit pants in premium fabric.',
		price: 35000,
		image: '/images/productimages/facade-clothing/5.png',
		emailImage: 'https://i.postimg.cc/52vLRR9d/5.png'
	},
	{
		id: 'id006',
		name: 'A street view of Yaowarat, Bangkok, Thailand',
		description: 'Minimalist sneakers for everyday wear.',
		price: 35000,
		image: '/images/productimages/facade-clothing/6.png',
		emailImage: 'https://i.postimg.cc/sgS7NNfD/6.png'
	}
];

export function findProductById(id: string) {
	return products.find((p) => p.id === id);
}

export function formatPrice(cents: number) {
	return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(cents / 100);
}

/**
 * Merge static product data with Firestore inventory data
 */
export function mergeProductWithInventory(
	product: Product,
	inventory: { stock: number; inStock: boolean; tags?: string[] } | null
): Product {
	if (!inventory) {
		return product; // Return product as-is if no inventory data
	}
	
	return {
		...product,
		stock: inventory.stock,
		inStock: inventory.inStock,
		tags: inventory.tags
	};
}


