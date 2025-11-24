'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from './CartContext';
import { formatPrice, findProductById } from '@/lib/products';
import styles from './CartSheet.module.css';

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
	const router = useRouter();
	const { items, removeItem, updateQuantity, total, clear } = useCart();

	const hasItems = items.length > 0;

	const lines = useMemo(
		() =>
			items.map((i, index) => {
				const product = findProductById(i.productId);
				return (
					<div
						key={`${i.productId}-${i.size}-${index}`}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '1rem'
						}}
					>
						<div
							style={{
								position: 'relative',
								width: '250px',
								height: '250px',
								border: '1px solid #000000',
								background: '#ffffff',
								borderRadius: '4px',
								overflow: 'hidden'
							}}
						>
							{product?.image ? (
								<Image
									src={product.image}
									alt={i.name}
									fill
									style={{ objectFit: 'cover' }}
									sizes="250px"
								/>
							) : (
								<div style={{
									width: '100%',
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: '#999',
									fontSize: '0.75rem'
								}}>
									No image
								</div>
							)}
						</div>
						<div style={{ 
							fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
							color: '#000000',
							fontSize: '0.9rem',
							textAlign: 'center'
						}}>
							{i.name || 'Prototype'}
						</div>
						<div style={{ 
							fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
							color: '#666',
							fontSize: '0.8rem',
							textAlign: 'center'
						}}>
							Size: {i.size}
						</div>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '1rem',
							marginTop: '0.5rem'
						}}>
							<button
								onClick={() => updateQuantity(i.productId, i.size, i.quantity - 1)}
								style={{
									width: '32px',
									height: '32px',
									border: '1px solid #000000',
									background: '#ffffff',
									color: '#000000',
									cursor: 'pointer',
									fontSize: '1.2rem',
									fontWeight: 'bold',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: '4px',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif'
								}}
							>
								-
							</button>
							<span style={{
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								color: '#000000',
								fontSize: '1rem',
								minWidth: '30px',
								textAlign: 'center'
							}}>
								{i.quantity}
							</span>
							<button
								onClick={() => updateQuantity(i.productId, i.size, i.quantity + 1)}
								style={{
									width: '32px',
									height: '32px',
									border: '1px solid #000000',
									background: '#ffffff',
									color: '#000000',
									cursor: 'pointer',
									fontSize: '1.2rem',
									fontWeight: 'bold',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: '4px',
									fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif'
								}}
							>
								+
							</button>
						</div>
					</div>
				);
			}),
		[items]
	);

	if (!open) return null;
	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(0,0,0,0.6)',
				backdropFilter: 'blur(2px)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 1000,
				padding: '1rem'
			}}
			onClick={onClose}
		>
			<div
				style={{ 
					width: '100%',
					maxWidth: '900px',
					maxHeight: '90vh',
					background: '#ffffff',
					overflowY: 'auto',
					padding: '2rem',
					display: 'flex',
					flexDirection: 'column',
					borderRadius: '8px',
					position: 'relative'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
					<h3 style={{ 
						margin: 0, 
						fontFamily: 'var(--font-unifraktur), "Old English Text MT", "Blackletter", serif',
						fontSize: '2rem',
						fontWeight: 'normal',
						color: '#000000',
						letterSpacing: '0.05em'
					}}>
						Shopping cart
					</h3>
					<button 
						onClick={onClose}
						style={{
							background: 'transparent',
							border: 'none',
							color: '#000000',
							padding: 0,
							cursor: 'pointer',
							fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
							fontSize: '1rem',
							fontWeight: 'normal'
						}}
					>
						Close
					</button>
				</div>

				<div className={styles.cartItemsGrid}>
					{hasItems ? lines : <div className={styles.emptyCart}>No items yet.</div>}
				</div>
				
				{hasItems && (
					<div style={{ 
						background: '#000000',
						padding: '1.5rem 2rem',
						marginTop: '2rem',
						borderRadius: '8px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}>
						<div style={{ 
							color: '#ffffff',
							fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
							fontSize: '1rem'
						}}>
							Total - {formatPrice(total)}
						</div>
						<button
							onClick={() => {
								onClose();
								router.push('/checkout');
							}}
							style={{
								background: 'transparent',
								border: '1px solid rgba(255, 255, 255, 0.3)',
								color: '#ffffff',
								padding: '0.5rem 1rem',
								cursor: 'pointer',
								fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
								fontSize: '1rem',
								fontWeight: '500',
								borderRadius: '4px'
							}}
						>
							Checkout
						</button>
					</div>
				)}
			</div>
		</div>
	);
}


