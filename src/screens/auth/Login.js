import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../../utils/fontFamily';
import { Formik } from 'formik'
import * as yup from 'yup';
import useAuth from '../../components/customhook/useAuth';
import { ROUTES } from '../../../services/routes';

const Login = ({ navigation }) => {

  const [showPassword, setShowPassword] = useState(true);
  const { initializing, user, signIn } = useAuth();


  const handleLogin = async (values) => {
    try {
      // Sign in and get user data
      const userCredential = await signIn(`${values.userId}@example.com`, values.password);
      const signedInUser = userCredential.user;

      // Access the user's email and perform further actions
      const userEmail = signedInUser.email;

      // Example: Check conditions based on the user's email
      if (userEmail === 'admin123@example.com') {
        // Do something for admin user
        navigation.navigate(ROUTES.DRAWER);
      } else {
        navigation.navigate(ROUTES.DASHBOARD);
        // Do something for regular user
      }

      // Navigate to the dashboard screen
    } catch (error) {
      console.error('Error signing in:', error);
    }

    // console.log('Logging in with:', values);
  };

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Text style={styles.logoText}>PythonSquare</Text>

      <Text style={styles.loginText}>Login</Text>
      <Formik
        initialValues={{ userId: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>

            <View style={styles.box}>
              <View style={[styles.inputContainer, styles.commonInputStyle]}>
                <TextInput
                  placeholderTextColor={COLOR.textGrey}
                  style={styles.input}
                  placeholder="User ID"
                  onChangeText={handleChange('userId')}
                  onBlur={handleBlur('userId')}
                  value={values.userId}
                />
                <Feather name="user" size={hp(3)} color={COLOR.textGrey} style={styles.icon} />
              </View>
              {touched.userId && errors.userId && (
                <Text style={styles.errorText}>{errors.userId}</Text>
              )}
            </View>

            <View style={styles.box}>
              <View style={[styles.inputContainer, styles.commonInputStyle]}>
                <TextInput
                  placeholderTextColor={COLOR.textGrey}
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={showPassword ? true : false}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity onPress={() => setShowPassword(preVal => !preVal)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={hp(3)}
                    color={COLOR.textGrey}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(3),
    backgroundColor: COLOR.screenBg,
    gap: hp(4)
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
    marginBottom: hp(4),
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
    color:COLOR.primaryBlue
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
  errorText: { color: COLOR.errorColor, fontSize: hp(2), fontFamily: FONTS.NunitoRegular }
});
