import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

export function getFirestoreInstance(): Firestore {
	// Return cached instance if available
	if (db) return db;

	const firebaseConfig = {
		apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
		authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
		projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
		storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
		appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
	};

	// Check for required config
	if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
		throw new Error('Firebase configuration is missing. Please set NEXT_PUBLIC_FIREBASE_* environment variables.');
	}

	// Initialize Firebase app (works on both server and client)
	if (getApps().length === 0) {
		app = initializeApp(firebaseConfig);
	} else {
		app = getApps()[0];
	}

	// Initialize Firestore
	db = getFirestore(app);
	return db;
}

