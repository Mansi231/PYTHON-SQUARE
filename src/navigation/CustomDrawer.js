import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { xt, useEffect, useState, useContext } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../pixel'
import { COLOR } from '../utils/color'
import { FONTS } from '../utils/fontFamily'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ROUTES } from '../../services/routes'
import useAuth from '../components/customhook/useAuth'

const CustomDrawer = (props) => {
    const { initializing, user, signIn, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            props.navigation.replace(ROUTES.LOGIN);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <View style={styles?.container}>
            <DrawerContentScrollView>
                <View style={styles?.headerContainer}>
                    <Text style={{ color: COLOR.black, fontSize: hp(2.2), fontFamily: FONTS.NunitoBold }}>{user?.email?.split('@')[0]} </Text>
                </View>

                <View style={{ paddingVertical: hp(2), }}>
                    <DrawerItemList {...props}
                        activeBackgroundColor="transparent"
                        inactiveBackgroundColor="transparent"
                    />
                </View>
            </DrawerContentScrollView>
            <View style={styles?.bottomTextContainer}>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles?.logoutContainer}>
                    <AntDesign name={'logout'} size={hp(2)} color={COLOR.primaryGreen} />
                    <Text style={styles?.logoutText}>Log Out</Text>
                </TouchableOpacity>
                <Text style={styles?.version}>Version 1.170</Text>
            </View>
        </View>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLOR.screenBg, paddingVertical: hp(3), width: wp(70) },
    nameText: { fontSize: hp(1.9), color: COLOR.primaryBlue, fontFamily: FONTS.InterSemiBold },
    userTypeText: { fontSize: hp(1.75), color: COLOR.textGrey, fontFamily: FONTS.InterSemiBold },
    headerContainer: {
        width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', gap: wp(1.2),
        marginHorizontal: wp(1), paddingHorizontal: wp(2.4)
    },
    bottomTextContainer: { paddingVertical: hp(2), flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: hp(1), width: '100%' },
    logoutIcon: { height: hp(1.9), width: hp(2), tintColor: COLOR.primaryGreen, alignSelf: 'center' },

    logoutContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: wp(2), width: '100%', marginLeft: -hp(1.3) },

    logoutText: { fontFamily: FONTS.InterMedium, fontSize: hp(2), color: COLOR.primaryGreen, textAlign: 'left' },
    version: { fontFamily: FONTS.InterMedium, fontSize: hp(1.68), color: COLOR.textGrey, width: '100%', textAlign: 'center' }
})