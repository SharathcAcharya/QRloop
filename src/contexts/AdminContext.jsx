import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AdminContext = createContext();

// Custom hook for admin context
// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const createAdmin = async (email, password, adminData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Add admin document to Firestore
      await setDoc(doc(db, 'admins', result.user.uid), {
        email,
        role: 'admin',
        createdAt: new Date(),
        ...adminData
      });

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOutAdmin = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    createAdmin,
    signOut: signOutAdmin
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
