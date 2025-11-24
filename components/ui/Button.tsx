'use client';

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary';
	fullWidth?: boolean;
};

export function Button({ variant = 'primary', fullWidth, style, ...props }: ButtonProps) {
	const base: React.CSSProperties = {
		cursor: 'pointer',
		background: 'var(--accent)',
		border: 'none',
		color: 'white',
		padding: '0.6rem 1rem',
		borderRadius: 8,
		fontWeight: 600,
		width: fullWidth ? '100%' : undefined
	};

	const secondary: React.CSSProperties =
		variant === 'secondary'
			? { background: 'var(--card)', border: '1px solid #2a2a2a', color: 'var(--text)' }
			: {};

	return <button {...props} style={{ ...base, ...secondary, ...style }} />;
}


