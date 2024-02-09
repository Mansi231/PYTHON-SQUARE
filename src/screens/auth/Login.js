import Toast from 'react-native-toast-message';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, ToastAndroid, StatusBar, Keyboard, Image } from 'react-native';
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
import logo from '../../assets/logo.png'
import TextInputCommon from '../../components/common/TextInputFloating';

const Login = ({ navigation }) => {

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const { setLoggedInUser } = useContext(ValContext)


  const handleLogin = async (values, { resetForm }) => {
    setLoading(true)
    try {
      // Sign in and get user data
      const userCredential = await signIn(values.userId, values.password);

      if (userCredential == null) { }
      const userId = userCredential.userId;

      setLoggedInUser(userCredential)
      if (userId) {
        setUser(userCredential)
      }
      navigation.navigate(ROUTES.DRAWER);
    } catch (error) {

      Toast.show({
        type: 'error',
        text1: `${error}`,
        visibilityTime: 3000,
        swipeable: true,
        text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
      });

    } finally {
      setLoading(false)
      // resetForm()
      Keyboard.dismiss()
    }

  };

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg, justifyContent: 'center', position: 'relative' }}>
      <StatusBar translucent backgroundColor={COLOR.screenBg} barStyle={'dark-content'} />

      <View style={styles?.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Feather name='arrow-left' size={hp(2.5)} color={COLOR.black} />
          <Image source={logo} style={{ height: hp(7), width: hp(7), alignSelf: 'flex-end', }} resizeMode='contain' />
        </View>
        <Text style={styles.loginText}>Login</Text>
      </View>

      <Formik
        initialValues={{ userId: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
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
            <Toast position='top' />

            <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color={COLOR.white} size={'large'} />
              ) : <Text style={styles.buttonText}>Login</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles?.bottomBox}>
        <Text style={styles.bottomLogoText}>pythonsquare</Text>
        <Text style={styles.bottomText}>
          Automated system to advance returns on your Equtiy
          Best Alternative to fix deposit at minimum risk with backtest results.</Text>
      </View>
    </SafeAreaView>
  );
};


export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(3),
    backgroundColor: COLOR.screenBg,
    gap: hp(4)
  },
  header: {
    position: 'absolute', top: StatusBar.currentHeight, zIndex: 1, paddingHorizontal: wp(4), right: 0, left: 0
  },
  logoText: {
    alignSelf: 'flex-end',
    marginVertical: hp(3),
    fontFamily: FONTS.NunitoSemiBold,
    fontSize: hp(2.5),
    color: COLOR.lightGrey70,
  },
  loginText: {
    fontSize: hp(3),
    color: COLOR.lightBlack,
    fontFamily: FONTS.NunitoMedium,
    marginTop: hp(4)
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
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    height: hp(7),
  },
  box: { display: 'flex', flexDirection: 'column', gap: hp(1) },
  errorText: { color: COLOR.errorColor, fontSize: hp(2), fontFamily: FONTS.NunitoRegular },
  bottomBox: { width: '100%', flexDirection: 'column', gap: hp(1), justifyContent: 'flex-start', alignItems: 'flex-start', paddingBottom: hp(7) },
  bottomLogoText: { color: COLOR.textGrey, fontFamily: FONTS.NunitoSemiBold, fontSize: hp(2.1), letterSpacing: wp(.1), textTransform: 'uppercase', textAlign: 'left' },
  bottomText: { color: COLOR.textGrey, fontFamily: FONTS.NunitoRegular, fontSize: hp(1.7), letterSpacing: wp(.1), textAlign: 'left' }
});
