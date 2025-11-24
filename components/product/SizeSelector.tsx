'use client';

import { useState } from 'react';
import { Product } from '@/lib/products';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

const SIZES = ['S', 'M', 'L', 'XL'];

export function SizeSelector({ product }: { product: Product }) {
	const [selectedSize, setSelectedSize] = useState<string | null>(null);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
			<div>
				<label style={{ 
					display: 'block', 
					marginBottom: '0.5rem', 
					fontWeight: 600,
					fontSize: '0.9rem'
				}}>
					Size
				</label>
				<div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
					{SIZES.map((size) => (
						<button
							key={size}
							type="button"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setSelectedSize(size);
							}}
							style={{
								padding: '0.5rem 1rem',
								border: selectedSize === size ? '2px solid #000' : '1px solid #ddd',
								background: selectedSize === size ? '#000' : '#fff',
								color: selectedSize === size ? '#fff' : '#000',
								borderRadius: 4,
								cursor: 'pointer',
								fontWeight: selectedSize === size ? 600 : 400,
								minWidth: '3rem',
								transition: 'all 0.2s'
							}}
						>
							{size}
						</button>
					))}
				</div>
			</div>
			<AddToCartButton product={product} size={selectedSize} />
		</div>
	);
}

