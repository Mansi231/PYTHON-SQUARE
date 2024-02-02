import Toast from 'react-native-toast-message';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ToastAndroid, ActivityIndicator, Keyboard, FlatList } from 'react-native';
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

const AddUser = ({navigation}) => {

  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const { users, setUsers } = useContext(ValContext)

  const handleAddUser = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(`${values.userId}@example.com`, values.password);
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        userId: values.userId,
        name: values.name,
        email: user.email,
        role: 'user'
      });


      Toast.show({
        type: 'success',
        text1: 'User added successfully',
        visibilityTime: 3000,
        text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
        swipeable: true
      });
    } catch (error) {

      if (error.code === 'auth/email-already-in-use') {
        Toast.show({
          type: 'error',
          text1: 'User id is already in use!',
          visibilityTime: 3000,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
          swipeable: true
        });

      } else if (error.code === 'auth/invalid-email') {
        Toast.show({
          type: 'error',
          text1: 'User id is invalid!',
          visibilityTime: 3000,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
          swipeable: true
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `${error}`,
          visibilityTime: 3000,
          swipeable: true,
          text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
        });
      }
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

  const renderUserItem = ({ item }) => {
    console.log(item, ':: item ::');
    return (
      <View style={[styles.tabelRow]}>
        <Text style={styles.cell}>{item.name}</Text>
        <Text style={styles.cell}>{item.userId}</Text>
        {/* Add more cells for other user information */}
      </View>
    )
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Formik
        initialValues={{ userId: '', password: '', name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUser}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>

            {/* Table Header */}
            <View style={{ justifyContent: 'flex-start', flexDirection: 'column', width: '100%', gap: hp(.5) }}>
              <View style={[styles.row, styles.header]}>
                <Text style={styles.headerText}>Name</Text>
                <Text style={styles.headerText}>User Id</Text>
                {/* Add more headers for other user information */}
              </View>

              {/* User Data */}
              {users != null && users?.length > 0 &&
                <View style={styles.tabelBody}>
                  <FlatList
                    data={users}
                    keyExtractor={(user) => user?.id?.toString()} // Assuming each user has a unique 'id'
                    renderItem={renderUserItem}
                    style={{ width: '100%' }}
                  />
                </View>
              }
            </View>


            <View style={styles.box}>
              <View style={[styles.inputContainer, styles.commonInputStyle]}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholderTextColor={COLOR.textGrey}
                />
                <Feather name="edit-2" size={hp(2.2)} color={COLOR.textGrey} style={styles.icon} />
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
                  placeholderTextColor={COLOR.textGrey}
                />
                <Feather name="user" size={hp(2.3)} color={COLOR.textGrey} style={styles.icon} />
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
                    size={hp(2.3)}
                    color={COLOR.textGrey}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
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
  tabelBody:{backgroundColor:COLOR.bgLightGrey,width:'100%'},

  tabelRow:{backgroundColor:COLOR.bgLightGrey,flexDirection:'row',paddingVertical: hp(1.5),justifyContent:'space-around',gap:wp(1),borderBottomColor:COLOR.borderGrey,borderBottomWidth:hp(.2)},
  cell:{color:COLOR.primaryBlue,fontFamily:FONTS.NunitoRegular,fontSize:hp(1.8)},
  headerText: { color: COLOR.black, fontFamily: FONTS.NunitoBold, fontSize: hp(2) },
});
