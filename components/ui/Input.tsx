'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
	return (
		<input
			ref={ref}
			{...props}
			style={{
				padding: 10,
				borderRadius: 8,
				border: '1px solid #2a2a2a',
				background: '#101010',
				color: 'white',
				width: '100%',
				...(props.style || {})
			}}
		/>
	);
});


