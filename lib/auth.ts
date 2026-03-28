import { signInWithPopup, signOut, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const signInWithGoogle = async (): Promise<AuthUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

export const signUpWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
