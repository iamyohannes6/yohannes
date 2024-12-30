import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1gdkDaac19sDdeeqWzmGz9dKzNcSxw8M",
  authDomain: "portfolio-1fb66.firebaseapp.com",
  projectId: "portfolio-1fb66",
  storageBucket: "portfolio-1fb66.firebasestorage.app",
  messagingSenderId: "991022028247",
  appId: "1:991022028247:web:a369fd175e56366194e792",
  measurementId: "G-8VJSECQWLG"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app)
export const db = getFirestore(app);
export const storage = getStorage(app)

export default app
