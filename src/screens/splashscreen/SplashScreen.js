import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { ROUTES } from '../../../services/routes';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = ({ navigation }) => {

    useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.LOGIN);
    }, 2000); 
    return () => clearTimeout(timer);
  }, [navigation]);


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
    letterSpacing:wp(.5)
  },
});

export default SplashScreen;
