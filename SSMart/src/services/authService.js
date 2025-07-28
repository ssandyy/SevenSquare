import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export class AuthService {
  // Sign up new user
  static async signUp(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name if provided
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || '',
        role: 'user', // Default role is user
        createdAt: new Date().toISOString(),
        ...userData
      });

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.displayName || '',
          role: 'user'
        }
      };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  // Sign in existing user
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData?.displayName || user.displayName || '',
          role: userData?.role || 'user'
        }
      };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        callback({
          uid: user.uid,
          email: user.email,
          displayName: userData?.displayName || user.displayName || '',
          role: userData?.role || 'user'
        });
      } else {
        callback(null);
      }
    });
  }

  // Get user data from Firestore
  static async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.data();
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(uid, userData) {
    try {
      await setDoc(doc(db, 'users', uid), userData, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export default AuthService; 