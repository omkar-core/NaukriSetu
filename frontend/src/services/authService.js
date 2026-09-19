import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './firebaseConfig.js';

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (err) {
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

export async function signInWithEmail(email, password, rememberMe = false) {
  const auth = getFirebaseAuth();
  try {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      return { success: false, error: 'Incorrect email or password. Please check your details and try again.' };
    }
    if (err.code === 'auth/too-many-requests') {
      return { success: false, error: 'Too many sign-in attempts. Please wait a few minutes before trying again or reset your password.' };
    }
    if (err.code === 'auth/user-disabled') {
      return { success: false, error: 'Your account has been temporarily suspended. Please contact support.' };
    }
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

export async function createAccount(email, password, name, preferences = {}) {
  const auth = getFirebaseAuth();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    await sendEmailVerification(result.user);

    const db = getFirebaseDb();
    const userRef = doc(db, 'users', result.user.uid);
    await setDoc(userRef, {
      uid: result.user.uid,
      email,
      displayName: name,
      createdAt: serverTimestamp(),
      preferences: {
        categories: preferences.categories || [],
        state: preferences.state || '',
        qualification: preferences.qualification || '',
        emailAlerts: preferences.emailAlerts !== false,
      },
      savedJobs: [],
      searchHistory: [],
      applicationTracker: [],
      isOnboarded: false,
    });

    return { success: true, user: result.user };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'This email is already registered with NaukriSetu. Would you like to sign in instead?' };
    }
    if (err.code === 'auth/network-request-failed') {
      return { success: false, error: 'No internet connection. Please check your connection and try again.' };
    }
    return { success: false, error: mapFirebaseError(err.code) };
  }
}

export async function signOut() {
  const auth = getFirebaseAuth();
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to sign out. Please try again.' };
  }
}

export async function sendPasswordReset(email) {
  const auth = getFirebaseAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      return { success: true };
    }
    if (err.code === 'auth/network-request-failed') {
      return { success: false, error: 'No internet connection. Please try again.' };
    }
    return { success: false, error: 'Failed to send reset email. Please try again.' };
  }
}

export function subscribeToAuthChanges(callback) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export async function saveUserPreferences(uid, preferences) {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, { preferences, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserData(uid) {
  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

function mapFirebaseError(code) {
  const map = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-credential': 'Incorrect email or password. Please check your details and try again.',
    'auth/popup-closed-by-user': 'Sign in was cancelled. Please try again.',
    'auth/popup-blocked': 'Sign in popup was blocked by your browser. Please allow popups for this site.',
    'auth/cancelled-popup-request': 'Sign in was cancelled.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/requires-recent-login': 'Please sign in again before making this change.',
    'auth/network-request-failed': 'No internet connection. Please check your connection and try again.',
  };
  return map[code] || 'An unexpected error occurred. Please try again.';
}
