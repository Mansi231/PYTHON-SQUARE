import { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { AppState } from 'react-native'; // Import AppState
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { setUser } from '../../asyncstorage/storage';

const useAuth = () => {
  const signIn = (id, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userSnapshot = await firestore().collection('users').where('userId', '==', id).get();

        if (userSnapshot.empty) {
          throw new Error('User does not exist');
        }

        userSnapshot.forEach(doc => {
          const userDoc = doc.data();
          const storedPassword = userDoc.password;

          if (password === storedPassword) {
            resolve(userDoc);
          } else {
            reject(new Error('Invalid password'));
          }
        });
      } catch (error) {
        console.error('Error signing in:', error.message);
        reject(error);
      }
    });
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
