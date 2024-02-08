import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, ActivityIndicator, Alert, Image } from 'react-native';
import { ROUTES } from '../../../services/routes';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel';
import useAuth from '../../components/customhook/useAuth';
import { ValContext } from '../../context/Context';
import { getUser } from '../../asyncstorage/storage';
import logo from '../../assets/logo.png'

const SplashScreen = ({ navigation }) => {

  const { initializing, signIn } = useAuth();
  const { loggedInUser } = useContext(ValContext)


  useEffect(() => {

    const fetchData = async () => {
      if (initializing) {
        return;
      }

      let user = await getUser();

      if (!user) {
        navigation.replace(ROUTES.LOGIN);
      } else if (user?.email === 'admin123@example.com') {
        navigation.replace(ROUTES.DRAWER);
      } else {
        navigation.replace(ROUTES.DASHBOARD);
      }
    };

    fetchData();
  }, [navigation, initializing]);


  if (initializing) {
    return (
      <View style={[styles.container, { backgroundColor: COLOR.bgLightGrey }]}>
        <ActivityIndicator size="large" color={COLOR.lightBlack} />
      </View>
    );
  }
  return (
    <View
      style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'}/>
      <Image source={logo} style={{ height: hp(12), width: hp(12) }} resizeMode='contain' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.bgLightGrey, // Set background color as needed
  },
  text: {
    fontSize: hp(4),
    fontFamily: FONTS.NunitoBold,
    color: COLOR.lightBlack,
    letterSpacing: wp(.5)
  },
});

export default SplashScreen;
