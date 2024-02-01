import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../../utils/fontFamily';
import { Formik } from 'formik'
import * as yup from 'yup';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

const AddUser = () => {

  const [showPassword, setShowPassword] = useState(true);

  const handleAddUser = async (values) => {

    auth()
      .createUserWithEmailAndPassword(`${values.userId}@example.com`, values.password)
      .then(({ user }) => {

        firestore().collection('users').doc(user.uid).set({
          userId: values.userId,
          name: values.name,
          email: user.email, // You can store email separately if needed
          role:'user'
          // Add other user information as needed
        }).then(() => {
          return ToastAndroid.showWithGravityAndOffset('User added successfully .', ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100)
          console.log('User added!');
        }).catch((error) => console.log(error, ' :: error in adding user ::'));

      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {

          return ToastAndroid.showWithGravityAndOffset('That user id is already in use!', ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100)

          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {

          return ToastAndroid.showWithGravityAndOffset('That user id is invalid!', ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100)

          console.log('That user id is invalid!');
        }

        console.error(error);
      });


  };

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required'),
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Formik
        initialValues={{ userId: '', password: '', name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUser}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>

            <View style={styles.box}>
              <View style={[styles.inputContainer, styles.commonInputStyle]}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <Feather name="edit-2" size={hp(2.8)} color={COLOR.textGrey} style={styles.icon} />
              </View>
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.box}>
              <View style={[styles.inputContainer, styles.commonInputStyle]}>
                <TextInput
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
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AddUser;

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
    fontSize: hp(2)
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
