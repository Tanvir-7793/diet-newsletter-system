import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFH-cYlYK3YD8y2v3ELIrCV8ICf1lj2Fs",
  authDomain: "bus-tracking-system-64fe5.firebaseapp.com",
  projectId: "bus-tracking-system-64fe5",
  storageBucket: "bus-tracking-system-64fe5.firebasestorage.app",
  messagingSenderId: "326795657760",
  appId: "1:326795657760:web:c8224d6abcad9b09947245",
  measurementId: "G-9TNQLBKGNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export default app;
