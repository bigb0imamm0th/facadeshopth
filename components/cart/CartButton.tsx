'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import { CartSheet } from './CartSheet';
import styles from './CartButton.module.css';

export function CartButton() {
	const { items } = useCart();
	const [open, setOpen] = useState(false);
	const count = items.reduce((acc, i) => acc + i.quantity, 0);

	return (
		<>
			<button 
				onClick={() => setOpen(true)} 
				aria-label="Open cart"
				className={styles.cartButton}
			>
				Cart
				{count > 0 && (
					<span className={styles.cartBadge} aria-label={`${count} items in cart`}>
						{count}
					</span>
				)}
			</button>
			<CartSheet open={open} onClose={() => setOpen(false)} />
		</>
	);
}


