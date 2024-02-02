import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { AppState } from 'react-native'; // Import AppState
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = () => {
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  const onAuthStateChanged = (user) => {
    if (initializing) setInitializing(false);
  };
  

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // unsubscribe on unmount
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    initializing,
    signIn,
    signOut,
  };
};

export default useAuth;
