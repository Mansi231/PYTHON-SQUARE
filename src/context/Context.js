import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';

export const ValContext = createContext();

const Context = ({ children }) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        try {
          const querySnapshot = await firestore().collection('users').where('role', '!=', 'admin').get();
          const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), label: doc.data().name, value: doc.id, }));
          setUsers(users)
        } catch (error) {
          console.log(error, ':: error while fetching users ::')
        }
    
      }

    return <ValContext.Provider value={{ users, setUsers }}>{children}</ValContext.Provider>
}
export default Context