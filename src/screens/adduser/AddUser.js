import Toast from 'react-native-toast-message';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ToastAndroid, ActivityIndicator, Keyboard, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../../utils/fontFamily';
import { Formik } from 'formik'
import * as yup from 'yup';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { ValContext } from '../../context/Context';
import TextInputCommon from '../../components/common/TextInputFloating';

const AddUser = ({ navigation }) => {

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const { users, setUsers } = useContext(ValContext)

  const handleAddUser = async (values, { resetForm }) => {
    try {
      setLoading(true);
      // Query Firestore to find the user
      const userSnapshot = await firestore().collection('users').where('userId', '==', values.userId?.trim()).get();
      if (userSnapshot.empty) {
        const newUserRef = await firestore().collection('users').add({
          userId: values.userId?.trim(),
          name: values.name?.trim(),
          password: values?.password?.trim(),
          role: 'user'
        });
        const userId = newUserRef.id;
        await newUserRef.update({ uid: userId });
        resetForm();
        Toast.show({
          type: 'success',
          text1: 'User added successfully',
          visibilityTime: 3000,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1), backgroundColor: COLOR.white },
          swipeable: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'User alredy exists !',
          visibilityTime: 3000,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1), backgroundColor: COLOR.white },
          swipeable: true
        });
      }
    } catch (error) {

      console.log(error);
      Toast.show({
        type: 'error',
        text1: `${error}`,
        visibilityTime: 3000,
        swipeable: true,
        text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1), backgroundColor: COLOR.white },
      });
    } finally {
      setLoading(false);
      Keyboard.dismiss();
      // resetForm();
    }
  };


  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required'),
  });

  const handlePerss = () => {
    navigation.goBack()
  }


  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <StatusBar translucent backgroundColor={COLOR.screenBg} barStyle={'dark-content'} />

      <View style={styles?.heading}>
        <TouchableOpacity activeOpacity={.5} onPress={handlePerss}>
          <Feather name='chevron-left' size={hp(3)} color={COLOR.black} />
        </TouchableOpacity>
        <Text style={styles.addUserHeading}>Add User</Text>
      </View>

      <Formik
        initialValues={{ userId: '', password: '', name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUser}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>

            <View style={styles.box}>
              <TextInputCommon
                keyboardType='default'
                placeholderTextColor={COLOR.textGrey}
                onChangeText={handleChange('name')}
                value={values.name}
                placeholder={'Name'}
                onBlur={() => handleBlur('name')}
                showIcon={(isFocused) => <Feather name="edit-2" size={hp(2.2)} color={isFocused ? COLOR.black : COLOR.textGrey} style={styles.icon} />}
              />

              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.box}>
              <TextInputCommon
                keyboardType='default'
                placeholderTextColor={COLOR.textGrey}
                onChangeText={handleChange('userId')}
                value={values.userId}
                placeholder={'User ID'}
                onBlur={() => handleBlur('userId')}
                showIcon={(isFocused) => <Feather name="user" size={hp(2.3)} color={isFocused ? COLOR.black : COLOR.textGrey} style={styles.icon} />}
              />

              {touched.userId && errors.userId && (
                <Text style={styles.errorText}>{errors.userId}</Text>
              )}
            </View>

            <View style={styles.box}>
              <TextInputCommon
                keyboardType='default'
                placeholderTextColor={COLOR.textGrey}
                onChangeText={handleChange('password')}
                value={values.password}
                placeholder={'Password'}
                onBlur={() => handleBlur('password')}
                secureTextEntry={showPassword ? true : false}
                showIcon={(isFocused) => <TouchableOpacity onPress={() => setShowPassword(preVal => !preVal)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={hp(2.3)}
                    color={isFocused ? COLOR.black : COLOR.textGrey}
                    style={styles.icon}
                  />
                </TouchableOpacity>}
              />

              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <Toast position='top' />

            <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color={COLOR.white} size={'large'} />
              ) : <Text style={styles.buttonText}>Add User</Text>
              }
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(3),
    backgroundColor: COLOR.screenBg,
    gap: hp(4)
  },
  heading: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  addUserHeading: {
    marginVertical: hp(3),
    fontFamily: FONTS.NunitoSemiBold,
    fontSize: hp(2.5),
    color: COLOR.black, letterSpacing: wp(.1), flexGrow: 1, textAlign: 'center'

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

  header: {
    width: '100%', paddingVertical: hp(1.5), paddingHorizontal: wp(3), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLOR.bgGrey, borderRadius: hp(.3), gap: wp(3)
  },
  tabelBody: { backgroundColor: COLOR.bgLightGrey, width: '100%' },

  tabelRow: { backgroundColor: COLOR.bgLightGrey, flexDirection: 'row', paddingVertical: hp(1.5), justifyContent: 'space-around', gap: wp(1), borderBottomColor: COLOR.borderGrey, borderBottomWidth: hp(.2) },
  cell: { color: COLOR.primaryBlue, fontFamily: FONTS.NunitoRegular, fontSize: hp(1.8) },
  headerText: { color: COLOR.black, fontFamily: FONTS.NunitoBold, fontSize: hp(2) },
});
