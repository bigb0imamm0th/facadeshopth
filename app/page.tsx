import styles from './home.module.css';

export default function HomePage() {
	return (
		<div className={styles.homeContainer}>
			<div className={styles.contentWrapper}>
				<h1 className={styles.shopTitle}>Shop now</h1>
				<div className={styles.productPlaceholders}>
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className={styles.placeholder} />
					))}
				</div>
			</div>
			<div className={styles.footer}>
				FACADE 2025
			</div>
		</div>
	);
}


