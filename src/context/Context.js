import React, { createContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { getUser, setUser } from '../asyncstorage/storage';

export const ValContext = createContext();

const Context = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userInvestDetail, setUserInvestDetail] = useState(null)

    useEffect(() => {
        const unsubscribe = getUsers();

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const unsubscribe = getUser()
            .then(async (t) => {
                setLoggedInUser(t);
                getUserInvestDetail(t?.uid)
            })
            .catch((error) => {
                console.error('Error fetching user type:', error);
            });
        return () => unsubscribe();
    }, [])


    useEffect(() => {
        const unsubscribe = async () => {
            if (loggedInUser?.uid) {
                getUserInvestDetail(loggedInUser?.uid)
            }
        }
        return () => unsubscribe()
    }, [loggedInUser?.uid])

    const getUserInvestDetail = (uid) => {
        firestore().collection('userInvestDetail').doc(uid)?.onSnapshot(documentSnapshot => {
            if (documentSnapshot.exists) {
                setUserInvestDetail(documentSnapshot.data())
            }
            else {
                setUserInvestDetail(null)
            }
        });
    }

    const getUsers = () => {
        // Listen for real-time updates using onSnapshot
        const unsubscribe = firestore()
            .collection('users')
            .where('role', '!=', 'admin')
            .onSnapshot((querySnapshot) => {
                const updatedUsers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    label: doc.data().name,
                    value: doc.id,
                }));

                // Update the state with the latest user data
                setUsers(updatedUsers);
            });

        return unsubscribe;
    };

    return <ValContext.Provider value={{ users, setUsers, loggedInUser, setLoggedInUser, userInvestDetail, setUserInvestDetail, getUserInvestDetail }}>{children}</ValContext.Provider>;
};

export default Context;
