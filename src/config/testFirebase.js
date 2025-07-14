import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Simple Firebase connection test
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    const testData = {
      test: true,
      message: 'Firebase connection test',
      timestamp: serverTimestamp()
    };
    
    // Use a collection that's explicitly allowed in our rules
    const docRef = await addDoc(collection(db, 'user_activity'), testData);
    console.log('✅ Firebase connection successful! Document ID:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    return { success: false, error: error.message };
  }
};

export default testFirebaseConnection;
