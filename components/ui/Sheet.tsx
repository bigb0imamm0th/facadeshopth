'use client';

import React from 'react';

type SheetProps = {
	open: boolean;
	onClose: () => void;
	width?: number;
	children: React.ReactNode;
};

export function Sheet({ open, onClose, width = 420, children }: SheetProps) {
	if (!open) return null;
	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(0,0,0,0.6)',
				backdropFilter: 'blur(2px)',
				display: 'flex',
				justifyContent: 'flex-end'
			}}
			onClick={onClose}
		>
			<div
				className="card"
				style={{ width, height: '100%', overflowY: 'auto', paddingBottom: 90 }}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}


