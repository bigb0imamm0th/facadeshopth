import Link from 'next/link';
import { CartButton } from '@/components/cart/CartButton';

export function Header() {
	return (
		<header className="main-header">
			<div className="header-container">
				<Link href="/shop" className="header-link header-shop-all">
					Shop
				</Link>
				<Link href="/" className="header-link header-logo">
					Facade
				</Link>
				<div className="header-cart">
					<CartButton />
				</div>
			</div>
		</header>
	);
}


