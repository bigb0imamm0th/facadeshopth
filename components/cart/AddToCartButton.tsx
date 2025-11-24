'use client';

import { useState } from 'react';
import { Product } from '@/lib/products';
import { useCart } from './CartContext';
import styles from './AddToCartButton.module.css';

export function AddToCartButton({ product, size }: { product: Product; size: string | null }) {
	const { addItem } = useCart();
	const [justAdded, setJustAdded] = useState(false);
	
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!size) {
			alert('Please select a size');
			return;
		}
		addItem(product, size);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 2000);
	};

	return (
		<div style={{ width: '100%', marginTop: '0.5rem' }}>
			<button 
				type="button"
				className={styles.addToCartButton}
				onClick={handleClick} 
				aria-label="Add to cart"
				disabled={!size}
			>
				{justAdded ? 'Added to Cart!' : 'Add to Cart'}
			</button>
		</div>
	);
}


