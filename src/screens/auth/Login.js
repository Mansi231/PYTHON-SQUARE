import Toast from 'react-native-toast-message';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, StatusBar, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../../utils/fontFamily';
import { Formik } from 'formik'
import * as yup from 'yup';
import useAuth from '../../components/customhook/useAuth';
import { ROUTES } from '../../../services/routes';
import { setUser } from '../../asyncstorage/storage';
import { ValContext } from '../../context/Context';
import logo from '../../assets/logo1.png'
import TextInputCommon from '../../components/common/TextInputFloating';

const Login = ({ navigation }) => {

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { setLoggedInUser, getUserInvestDetail } = useContext(ValContext)


  const handleLogin = async (values, { resetForm }) => {
    setLoading(true)
    signIn(values?.userId?.trim(), values?.password?.trim())
      .then(userDoc => {
        getUserInvestDetail(userDoc?.uid)
        setLoggedInUser(userDoc)
        setUser(userDoc)
        setLoading(false)
        Keyboard.dismiss()
        navigation.navigate(ROUTES.DRAWER);

      })
      .catch(error => {
        setLoading(false)
        // resetForm()
        Keyboard.dismiss()
        Toast.show({
          type: 'error',
          text1: `${error}`,
          visibilityTime: 3000,
          swipeable: true,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
        });

        // Handle authentication error
        console.error('Error signing in:', error.message);
      });

  };

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg, justifyContent: 'center', position: 'relative', }}>
      <StatusBar translucent backgroundColor={COLOR.screenBg} barStyle={'dark-content'} />

      <Image source={logo} style={{ height: hp(10), width: hp(10), alignSelf: 'flex-end', }} resizeMode='contain' />
      <Text style={styles.loginText}>Login</Text>

      <Formik
        initialValues={{ userId: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            <Text style={styles.centerText}>Systems work, People Fail..!</Text>
            <View style={styles.box}>

              <TextInputCommon
                keyboardType='default'
                placeholderTextColor={COLOR.textGrey}
                onChangeText={handleChange('userId')}
                value={values.userId}
                placeholder={'User ID'}
                onBlur={() => handleBlur('userId')}
                showIcon={(isFocused) => <Feather name="user" size={hp(2.6)} color={isFocused ? COLOR.black : COLOR.textGrey} style={styles.icon} />}
              />

              {touched.userId && errors.userId && (
                <Text style={styles.errorText}>{errors.userId}</Text>
              )}
            </View>

            <View style={styles.box}>
              <TextInputCommon
                keyboardType='default'
                placeholderTextColor={COLOR.textGrey}
                placeholder="Password"
                secureTextEntry={showPassword ? true : false}
                onChangeText={handleChange('password')}
                onBlur={() => handleBlur('password')}
                value={values.password}
                showIcon={(isFocused) => <TouchableOpacity onPress={() => setShowPassword(preVal => !preVal)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={hp(2.5)}
                    color={isFocused ? COLOR.black : COLOR.textGrey}
                    style={styles.icon}
                  />
                </TouchableOpacity>}

              />

              {touched.password && errors.password && (
                loading ? (
                  <ActivityIndicator color={COLOR.white} size={'large'} />
                ) :
                  (<Text style={styles.errorText}>{errors.password}</Text>)
              )}
            </View>

            <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color={COLOR.white} size={'small'} />
              ) : <Text style={styles.buttonText}>Login</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Toast position='top' />

      <View style={styles?.bottomBox}>
        <Text style={styles.bottomLogoText}>pythonsquare</Text>
        <Text style={styles.bottomText}>
          {'\u2022'} Automated system to advance returns on your Equtiy.{'\n'}
          {'\u2022'} Best Alternative to fix deposit at minimum risk with backtest results.{'\n'}
          {'\u2022'} Business of POSSIBLITY & PROBABILITY
        </Text>
      </View>
    </SafeAreaView>
  );
};


export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(1),
    backgroundColor: COLOR.screenBg,
    gap: hp(4),
    marginTop: hp(8)
  },
  centerText: {
    fontSize: hp(2), fontFamily: FONTS.NunitoSemiBold, color: COLOR.black80, letterSpacing: wp(.1)
  },
  header: {
    // position: 'absolute', top: StatusBar.currentHeight, zIndex: 1, paddingHorizontal: wp(4), right: 0, left: 0
  },
  logoText: {
    alignSelf: 'flex-end',
    fontFamily: FONTS.NunitoSemiBold,
    fontSize: hp(2.5),
    color: COLOR.lightGrey70,
  },
  loginText: {
    fontSize: hp(3),
    color: COLOR.lightBlack,
    fontFamily: FONTS.NunitoMedium,
    marginTop: hp(2)
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: COLOR.borderGrey,
    borderWidth: hp(.23),

  },
  input: {
    flex: 1,
    paddingHorizontal: wp(2),
    fontFamily: FONTS.NunitoMedium,
    fontSize: hp(2),
    color: COLOR.primaryBlue
  },
  icon: {
    marginLeft: wp(2),
  },
  button: {
    backgroundColor: COLOR.blue,
    paddingVertical: hp(1),
    paddingHorizontal: hp(2),
    borderRadius: hp(.2),
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: COLOR.white,
    textAlign: 'center',
    fontFamily: FONTS.NunitoMedium,
    letterSpacing: wp(.3),
    fontSize: hp(2.2),
  },

  commonInputStyle: {
    borderRadius: hp(.5),
    paddingHorizontal: wp(2),
    paddingRight: wp(3),
    height: hp(6),
  },
  box: { display: 'flex', flexDirection: 'column', gap: hp(1) },
  errorText: { color: COLOR.errorColor, fontSize: hp(2), fontFamily: FONTS.NunitoRegular },
  bottomBox: { width: '100%', flexDirection: 'column', gap: hp(1), justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: hp(7) },
  bottomLogoText: { color: COLOR.textGrey, fontFamily: FONTS.NunitoSemiBold, fontSize: hp(2.1), letterSpacing: wp(.1), textTransform: 'uppercase', textAlign: 'left' },
  bottomText: { color: COLOR.textGrey, fontFamily: FONTS.NunitoRegular, fontSize: hp(1.7), letterSpacing: wp(.1), textAlign: 'left' }
});
