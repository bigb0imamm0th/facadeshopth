'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/components/cart/CartContext';
import styles from './ProductCard.module.css';

const SIZES = ['S', 'M', 'L', 'XL'];

export function ProductCard({ product }: { product: Product }) {
	const { addItem } = useCart();
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [justAdded, setJustAdded] = useState(false);

	const handleAddToCart = () => {
		if (!selectedSize) {
			alert('Please select a size');
			return;
		}
		// Check if product is in stock
		if (product.inStock === false || (product.stock !== undefined && product.stock <= 0)) {
			alert('This product is out of stock');
			return;
		}
		addItem(product, selectedSize);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 2000);
	};
	
	const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0);

	return (
		<div className={styles.productCard}>
			<Link href={`/product/${product.id}`} className={styles.productImageLink}>
				<div className={styles.productImage}>
					<Image
						src={product.image}
						alt={product.name}
						fill
						style={{ objectFit: 'cover' }}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			</Link>
			
			<div className={styles.productInfo}>
				<Link href={`/product/${product.id}`} className={styles.productNameLink}>
					<h3 className={styles.productName}>{product.name}</h3>
				</Link>
				
				<div className={styles.productPrice}>{formatPrice(product.price)}</div>
				
				{product.stock !== undefined && (
					<div style={{
						fontSize: '0.875rem',
						color: product.inStock ? '#666' : '#ef4444',
						marginBottom: '0.5rem'
					}}>
						{product.inStock ? `Stock: ${product.stock}` : 'Out of Stock'}
					</div>
				)}
				
				<div className={styles.sizeSection}>
					<div className={styles.sizeLabel}>Size</div>
					<div className={styles.sizeButtons}>
						{SIZES.map((size) => (
							<button
								key={size}
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setSelectedSize(size);
								}}
								className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonSelected : ''}`}
							>
								{size}
							</button>
						))}
					</div>
				</div>
				
				<button
					type="button"
					onClick={handleAddToCart}
					disabled={!selectedSize || isOutOfStock}
					className={`${styles.addToCartButton} ${!selectedSize || isOutOfStock ? styles.addToCartButtonDisabled : ''}`}
				>
					{isOutOfStock ? 'OUT OF STOCK' : justAdded ? 'Added!' : 'ADD TO CART'}
				</button>
			</div>
		</div>
	);
}


