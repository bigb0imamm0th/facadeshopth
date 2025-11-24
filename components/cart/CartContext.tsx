'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/lib/products';

export type CartItem = {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	size: string;
};

type CartContextValue = {
	items: CartItem[];
	total: number;
	addItem: (product: Product, size: string) => void;
	removeItem: (productId: string, size: string) => void;
	updateQuantity: (productId: string, size: string, quantity: number) => void;
	clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'facade_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.every((i: any) => i.size)) {
					setItems(parsed);
				}
			}
		} catch {
			// ignore
		}
	}, []);

	// Save to localStorage whenever items change
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {
			// ignore
		}
	}, [items]);

	const addItem = useCallback((product: Product, size: string) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.productId === product.id && i.size === size);
			if (existing) {
				return prev.map((i) =>
					i.productId === product.id && i.size === size
						? { ...i, quantity: i.quantity + 1 }
						: i
				);
			}
			return [...prev, {
				productId: product.id,
				name: product.name,
				price: product.price,
				quantity: 1,
				size
			}];
		});
	}, []);

	const removeItem = useCallback((productId: string, size: string) => {
		setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)));
	}, []);

	const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
		setItems((prev) => {
			if (quantity <= 0) {
				return prev.filter((i) => !(i.productId === productId && i.size === size));
			}
			return prev.map((i) =>
				i.productId === productId && i.size === size
					? { ...i, quantity }
					: i
			);
		});
	}, []);

	const clear = useCallback(() => setItems([]), []);

	const total = useMemo(
		() => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[items]
	);

	const value = useMemo(
		() => ({ items, total, addItem, removeItem, updateQuantity, clear }),
		[items, total, addItem, removeItem, updateQuantity, clear]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
}


