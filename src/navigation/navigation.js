import Toast from 'react-native-toast-message';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Keyboard } from 'react-native';
import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import { NavigationContainer, useFocusEffect, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { removeBackHandler } from '../../permission';
import CustomDrawer from './CustomDrawer';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../pixel';
import { ROUTES } from '../../services/routes';
import SplashScreen from '../screens/splashscreen/SplashScreen';
import Login from '../screens/auth/Login';
import { COLOR } from '../utils/color';
import { FONTS } from '../utils/fontFamily';
import AddUser from '../screens/adduser/AddUser';
import AddUserDetail from '../screens/adduserdetail/AddUserDetail';
import Dashboard from '../screens/dashboard/Dashboard';
import Feather from 'react-native-vector-icons/Feather'
import Users from '../screens/users/Users';
import AddUserInfo from '../screens/adduserdetail/AddUserInfo';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerScreen = ({ navigation }) => {

    const routes = [
        { name: ROUTES.ADD_USER_INFO, icon: 'edit-3', iconBorder: true, component: AddUserInfo, title: 'Add User Detail' },
        { name: ROUTES.USERS, icon: 'user-plus', component: Users, title: 'Users' },
        // { name: ROUTES.ADD_USER_DETAIL, icon: 'edit-3', iconBorder: true, component: AddUserDetail, title: 'Add User Detail' },
    ];

    const focusEffectCallback = useCallback(() => {
        const backHandler = removeBackHandler();

        return () => {
            backHandler.remove();
        };
    }, []);

    useFocusEffect(focusEffectCallback);

    const renderDrawerItem = ({ name, icon, borderTop, iconBorder, component, title }) => (
        <Drawer.Screen
            key={name}
            name={name}
            component={component}
            options={{
                title,
                drawerLabel: ({ focused, color, size }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(3), gap: wp(2) }}>
                        <Feather name={icon} size={hp(2.3)} color={color} style={{ marginRight: wp(2) }} />
                        <Text style={{ color: focused ? COLOR.blue : COLOR.black, fontSize: hp(1.6), fontFamily: FONTS.NunitoMedium, marginVertical: hp(.7), textAlign: 'center' }}>
                            {title}
                        </Text>
                    </View>
                ),
                drawerLabelStyle: { fontSize: hp(1.6), fontFamily: FONTS.NunitoMedium, paddingLeft: wp(2), marginVertical: hp(.7) },
                drawerActiveTintColor: COLOR.blue,
                drawerInactiveTintColor: COLOR.black,
                headerShown: true,
                headerStyle: { backgroundColor: COLOR.blue, height: hp(12) },
                headerTintColor: COLOR.white,
                headerTitleStyle: { fontFamily: FONTS.NunitoMedium, letterSpacing: wp(.2), fontSize: hp(2) },
                headerLeft: ({ color, onPress }) => (
                    <TouchableOpacity style={{ marginLeft: wp(3) }} onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer());Keyboard.dismiss()}}>
                        <Feather name="menu" size={hp(2.3
                        )} color={COLOR.white} style={{ marginRight: wp(2) }} />
                    </TouchableOpacity>
                ),
            }}
        />
    );

    return (
        <Drawer.Navigator
            drawerStyle={{}}
            screenOptions={{
                drawerStyle: { backgroundColor: COLOR.screenBg, width: wp(70) }
            }}
            drawerContent={(props) => <CustomDrawer {...props} drawerType="slide"
            />}
        >

            {routes.map((route) => renderDrawerItem(route))}

        </Drawer.Navigator>
    )
};


const Navigation = ({ navigation }) => {
    const navigationRef = useRef();

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator>
                <Stack.Screen
                    name={ROUTES.SPLASH_SCREEN}
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name={ROUTES.LOGIN}
                    component={Login}
                    options={{ headerShown: false }}
                />

                {/* DrawerScreen */}
                <Stack.Screen
                    name={ROUTES.DRAWER}
                    component={DrawerScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ROUTES.DASHBOARD}
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name={ROUTES.ADD_USER}
                    component={AddUser}
                    options={{ headerShown: false }}
                />


            </Stack.Navigator>
            <Toast />

        </NavigationContainer>
    );
};

export default Navigation;

const styles = StyleSheet.create({
    drawerItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: wp(2.4),
        gap: wp(3), width: '100%'
    },
    drawerText: {
        fontSize: hp(1.9),
        fontFamily: FONTS.NunitoSemiBold,
        color: COLOR.primaryBlue,
    },
    tabIconContainer: {
        alignSelf: 'center', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'column'
    },
    tabIcon: {
        width: '100%',
        fontSize: hp(3.3),

    },
    tabBarLabel: {
        color: COLOR.lightGrey70,
        fontSize: hp(1.48),
        fontFamily: FONTS.NunitoMedium, width: '100%',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: hp(3), textAlignVertical: 'center'
    }
});
