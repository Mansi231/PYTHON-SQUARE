import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
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

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerScreen = ({ navigation }) => {

    const routes = [
        { name: ROUTES.ADD_USER_DETAIL, icon: 'stats-chart', iconBorder: true, component: AddUserDetail, title: 'Add User Detail' },
        { name: ROUTES.ADD_USER, icon: 'person-sharp', component: AddUser, title: 'Add User' },
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
                drawerLabel: title,
                drawerActiveTintColor: COLOR.blue,
                drawerInactiveTintColor: COLOR.black,
                headerShown: true,
                headerStyle:{backgroundColor:COLOR.blue}
            }}
        />
    );

    return (
        <Drawer.Navigator
            drawerStyle={{}}
            screenOptions={{
                drawerStyle: { backgroundColor: COLOR.screenBg, width: wp(70) }
            }}
        // drawerContent={(props) => <CustomDrawer {...props} drawerType="slide"
        // />}
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
                {/* <Stack.Screen
                    name={ROUTES.SPLASH_SCREEN}
                    component={SplashScreen}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name={ROUTES.LOGIN}
                    component={Login}
                    options={{ headerShown: false }}
                /> */}
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


            </Stack.Navigator>
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
