// Simulating Firebase Auth with a Mock Service for Template use
import useAuthStore from '../store/useAuthStore';

// Check if real keys are provided (we use a simple check against the dummy key)
const isConfigured = 
  process.env.REACT_APP_FIREBASE_API_KEY && 
  process.env.REACT_APP_FIREBASE_API_KEY !== "AIzaSyDummyKeyForTemplate";

// Mock delay to simulate network request
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const signInWithEmailAndPassword = async (authObj, email, password) => {
  await delay(1000); // simulate network
  if (email && password.length >= 6) {
    const mockUser = {
      uid: `mock_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`,
      role: 'customer'
    };
    return { user: mockUser };
  }
  throw new Error("auth/wrong-password");
};

export const createUserWithEmailAndPassword = async (authObj, email, password) => {
  await delay(1200);
  if (email && password.length >= 6) {
    const mockUser = {
      uid: `mock_${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      role: 'customer'
    };
    return { user: mockUser };
  }
  throw new Error("auth/email-already-in-use");
};

export const signInWithPopup = async (authObj, provider) => {
  await delay(800);
  const mockUser = {
    uid: `mock_google_${Date.now()}`,
    email: 'google.user@example.com',
    displayName: 'Google User',
    photoURL: `https://ui-avatars.com/api/?name=Google+User&background=3B82F6&color=fff`,
    role: 'customer'
  };
  return { user: mockUser };
};

export const signOut = async () => {
  await delay(500);
  return true;
};

// Dummy exports to match firebase API
export const getAuth = () => ({}); 
export const GoogleAuthProvider = class {};
export const auth = {};
export const googleProvider = new GoogleAuthProvider();
