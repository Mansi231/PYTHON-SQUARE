import AsyncStorage from "@react-native-async-storage/async-storage";

export const keys = { USER: 'user' }

export const setUser =async (value) =>
    await AsyncStorage.setItem(keys.USER, JSON.stringify(value))
        .then((res) => {
            console.log(':: saved to storage ::',res);
        })
        .catch((error) => {
        });

export const getUser = async () =>
    await AsyncStorage.getItem(keys.USER).then((user) => JSON.parse(user) || null)
        .catch((error) => {
            return null; // Return a default value in case of an error
        });