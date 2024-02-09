import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { AppState } from 'react-native'; // Import AppState
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const useAuth = () => {

  const signIn = async (id, password) => {
    try {
      const userSnapshot = await firestore().collection('users').where('userId', '==', id).get();

      if (userSnapshot.empty) {
        throw 'User does not exists';
      }
      const userDoc = userSnapshot.docs[0].data();
      const storedPassword = userDoc.password;

      if (password === storedPassword) {
        return userDoc;
      } else {
        throw 'Invalid Password';
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    signIn,
    signOut,
  };
};

export default useAuth;
