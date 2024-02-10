import { BackHandler, PermissionsAndroid, Platform } from "react-native"

export const androidCameraPermission = () => new Promise(async (resolve, reject) => {
    try {
        if (Platform.OS === 'android' && Platform.Version > 22) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ]);
            console.log(PermissionsAndroid.RESULTS.GRANTED, granted['android.permission.WRITE_EXTERNAL_STORAGE'])
            if (
                granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
            ) {

                return resolve(false);
            }
            return resolve(true);
        }
        return resolve(true);
    }
    catch (error) {
        return resolve(false);
    }
});

export const removeBackHandler = () => {
    return BackHandler.addEventListener('hardwareBackPress', () => true)
}

export const backHandlerNavigation = (route,navigation) => {
    return BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate(route);
        return true; // Prevent default back button behavior
    })
}
