import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, ActivityIndicator } from 'react-native';
import { ROUTES } from '../../../services/routes';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel';
import LinearGradient from 'react-native-linear-gradient';
import useAuth from '../../components/customhook/useAuth';

const SplashScreen = ({ navigation }) => {

  const { initializing, user, signIn } = useAuth();

  useEffect(() => {
    if (initializing) {
      return;
    }
    if (user === null) return navigation.replace(ROUTES.LOGIN);
    if (user.email == 'admin123@example.com') return navigation.replace(ROUTES.DRAWER);
    else return navigation.replace(ROUTES.DASHBOARD);


  }, [navigation,initializing]);

  if (initializing) {
    return (
      <View style={[styles.container, { backgroundColor: COLOR.bgLightGrey }]}>
        <ActivityIndicator   size="large" color={COLOR.lightBlack} />
      </View>
    );
  }
  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Text style={styles.text}>PythonSquare</Text>
    </LinearGradient>
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
