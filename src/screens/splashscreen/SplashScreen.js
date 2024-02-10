import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, ActivityIndicator, Alert, Image } from 'react-native';
import { ROUTES } from '../../../services/routes';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel';
import useAuth from '../../components/customhook/useAuth';
import { ValContext } from '../../context/Context';
import { getUser } from '../../asyncstorage/storage';
import logo from '../../assets/logo1.png'

const SplashScreen = ({ navigation }) => {

  const { loggedInUser } = useContext(ValContext)


  useEffect(() => {

    const fetchData = async () => {

      let user = await getUser();

      if (!user) {
        navigation.replace(ROUTES.LOGIN);
      } else {
        navigation.replace(ROUTES.DRAWER);
      }
    };

    fetchData();
  }, [navigation]);

  return (
    <View
      style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'}/>
      <Image source={logo} style={{ height: hp(18), width: hp(18) }} resizeMode='contain' />
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
