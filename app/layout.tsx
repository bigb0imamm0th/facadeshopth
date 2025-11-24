import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import { Header } from '@/components/layout/Header';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
});

const unifrakturMaguntia = localFont({
	src: '../fonts/UnifrakturMaguntia-Regular.woff2',
	variable: '--font-unifraktur',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Facade Shop',
	description: 'A minimal e-commerce starter with Next.js and EmailJS'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${unifrakturMaguntia.variable}`} style={{ height: '100%' }}>
			<body style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
				<CartProvider>
					<Header />
					<main style={{ flex: 1, overflow: 'auto' }}>{children}</main>
				</CartProvider>
			</body>
		</html>
	);
}


