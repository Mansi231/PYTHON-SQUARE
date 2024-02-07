import Toast from 'react-native-toast-message';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ToastAndroid, ActivityIndicator, StatusBar, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel'
import { COLOR } from '../../utils/color'
import { Formik } from 'formik'
import * as yup from 'yup';
import Dropdown from '../../components/common/DropDown'
import DatePicker from 'react-native-date-picker';
import moment from 'moment'
import { FONTS } from '../../utils/fontFamily'
import { SafeAreaView } from 'react-native-safe-area-context'
import TextInput from '../../components/common/TextInput'
import firestore from '@react-native-firebase/firestore';
import { ValContext } from '../../context/Context';
import TextInputCommon from '../../components/common/TextInputFloating';
import DropdownFloating from '../../components/common/DropDownFloating';

const AddUserDetail = () => {

  const [open, setOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  const { users, setUsers } = useContext(ValContext)

  const getUsers = async () => {
    try {
      const querySnapshot = await firestore().collection('users').where('role', '!=', 'admin').get();
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), label: doc.data().name, value: doc.id, }));
      setUsers(users)
    } catch (error) {
      console.log(error, ':: error while fetching users ::')
    }

  }

  const validationSchema = yup.object().shape({
    selectedDate: yup.date().required('Target Date is required'),
    selectedUser: yup.object().nullable().required('Please select user'),
    realised: yup.object().shape({
      type: yup.string().required('Please select an option from the dropdown'),
      value: yup.number().nullable().required('Realised P&L is required'),
    }),
    charges: yup.object().shape({
      type: yup.string().required('Please select an option from the dropdown'),
      value: yup.number().nullable().required('Charges & Taxes is required'),
    }),
    credits: yup.object().shape({
      type: yup.string().required('Please select an option from the dropdown'),
      value: yup.number().nullable().required('Charges & Taxes is required'),
    }),
    netRealised: yup.object().shape({
      type: yup.string().required('Please select an option from the dropdown'),
      value: yup.number().nullable().required('Charges & Taxes is required'),
    }),
    unrealised: yup.object().shape({
      type: yup.string().required('Please select an option from the dropdown'),
      value: yup.number().nullable().required('Charges & Taxes is required'),
    }),
  });

  const handleAddUserDetail = async (values, { resetForm }) => {
    try {
      setLoading(true);

      const userDetailDocRef = firestore()
        .collection('userDetail')
        .doc(values.selectedUser.id)
        .collection('details')
        .doc(values.selectedDate.format('YYYY-MM-DD'));

      const existingDoc = await userDetailDocRef.get();

      if (existingDoc.exists) {
        // If the document exists, update it
        await userDetailDocRef.update({
          realised: values.realised,
          charges: values.charges,
          credits: values.credits,
          netRealised: values.netRealised,
          unrealised: values.unrealised,
        });
      } else {
        // If the document doesn't exist, add a new one
        await userDetailDocRef.set({
          realised: values.realised,
          charges: values.charges,
          credits: values.credits,
          netRealised: values.netRealised,
          unrealised: values.unrealised,
        });
      }
      Toast.show({
        type: 'success',
        text1: 'User detail added successfully.',
        visibilityTime: 3000,
        text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
        swipeable: true,
        topOffset: scrollOffset + statusBarHeight,
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Error while adding details.`,
        visibilityTime: 3000,
        swipeable: true,
        text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
        topOffset: scrollOffset + statusBarHeight,
      });
    } finally {
      Keyboard.dismiss()
      // resetForm();
      setLoading(false);
    }
  }

  const onFocus = () => {
    setShowDropdown(false)
  }

  const fieldsOption = [{ label: 'profit', value: 'profit' }, { label: 'loss', value: 'loss' }]

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <StatusBar translucent backgroundColor={COLOR.blue} barStyle={'light-content'} />
      <TouchableOpacity activeOpacity={1} onPress={() => setShowDropdown(false)}>
        <Formik
          initialValues={
            {
              selectedDate: moment(),
              selectedUser: null,
              realised: { type: fieldsOption[0]?.label, value: null, label: 'Realised P&L ' },
              charges: { type: fieldsOption[0]?.label, value: null, label: 'Charges & Taxes' },
              credits: { type: fieldsOption[0]?.label, value: null, label: 'Other credits & debits' },
              netRealised: { type: fieldsOption[0]?.label, value: null, label: 'Net realised P&L' },
              unrealised: { type: fieldsOption[0]?.label, value: null, label: 'Unrealised P&L' },
            }
          }

          validationSchema={validationSchema}
          onSubmit={handleAddUserDetail}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, rese }) => (

            <>
              <ScrollView
                onScroll={(event) => {
                  setScrollOffset(event.nativeEvent.contentOffset.y);
                }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(15) }} style={{ width: '100%' }}>

                <View style={styles.container}>

                  {/* Date Picker */}

                  <View style={styles?.box}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[styles.datePickerViewStyle,{position:'relative'}]}
                      onPress={() => {
                        setOpen(!open);
                      }}>
                        <Text style={{position:'absolute',top:-hp(1),backgroundColor:COLOR.screenBg,zIndex:1000,left:wp(1),paddingHorizontal:wp(1)}}>Select Date</Text>
                      <Text
                        style={[styles.datePickerStyle,]}>
                        {values?.selectedDate?.format('DD-MM-YYYY')}
                      </Text>
                    </TouchableOpacity>
                    <DatePicker
                      theme='dark'
                      modal
                      open={open}
                      date={values?.selectedDate?.toDate()}
                      mode={'date'}
                      onConfirm={val => {
                        setOpen(false);
                        setFieldValue('selectedDate', moment(val))
                      }}
                      maximumDate={moment().toDate()}
                      // minimumDate={moment()?.toDate()}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />
                  </View>

                  {/* Select user */}

                  <View style={styles?.box}>

                    <DropdownFloating placeholder={'Select User'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'selectedUser'} style={{ width: 'auto' }} options={users} onSelect={(item) => {
                      setFieldValue('selectedUser', item)
                    }} value={values?.selectedUser?.label} />

                    {touched.selectedUser && errors.selectedUser && (
                      <Text style={styles.errorText}>{errors.selectedUser}</Text>
                    )}
                  </View>

                  {/* Realised P&L  */}

                  <View style={styles?.box}>

                    <View style={styles?.fieldBox}>
                      <TextInputCommon
                        onFocus={onFocus}
                        style={[{ flexGrow: 1, width: 'auto' }]}
                        editable={true}
                        placeholder={'Realised P&L'}
                        require={true}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setFieldValue('realised', { ...values?.realised, value: text.replace(',', '') })}
                        value={values?.realised?.value}
                        onBlur={handleBlur(`realised`)}
                      />
                      <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'realised'} options={fieldsOption} onSelect={(item) => {
                        setFieldValue('realised', { ...values?.realised, type: item?.value })
                      }} value={values?.realised?.type} />

                    </View>
                    {touched.realised && errors.realised && (
                      <Text style={styles.errorText}>{errors.realised?.value}</Text>
                    )}
                  </View>

                  {/* Charges & Taxes */}
                  <View style={styles?.box}>
                    <View style={styles?.fieldBox}>
                      <TextInputCommon
                        onFocus={onFocus}
                        style={[{ flexGrow: 1, width: 'auto' }]}
                        editable={true}
                        placeholder={'Charges & Taxes '}
                        require={true}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setFieldValue('charges', { ...values?.charges, value: text.replace(',', '') })}
                        value={values?.charges?.value}
                        onBlur={handleBlur(`charges`)}
                      />
                      <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'charges'} options={fieldsOption} onSelect={(item) => {
                        setFieldValue('charges', { ...values?.charges, type: item?.value })
                      }} value={values?.charges?.type} />

                    </View>
                    {touched.charges && errors.charges && (
                      <Text style={styles.errorText}>{errors.charges?.value}</Text>
                    )}
                  </View>

                  {/* Other credits & debits  */}
                  <View style={styles?.box}>
                    <View style={styles?.fieldBox}>
                      <TextInputCommon
                        style={[{ flexGrow: 1, width: 'auto' }]}
                        onFocus={onFocus}
                        editable={true}
                        placeholder={'Other credits & debits'}
                        require={true}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setFieldValue('credits', { ...values?.credits, value: text.replace(',', '') })}
                        value={values?.credits?.value}
                        onBlur={handleBlur(`credits`)}
                      />
                      <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'credits'} options={fieldsOption} onSelect={(item) => {
                        setFieldValue('credits', { ...values?.credits, type: item?.value })
                      }} value={values?.credits?.type} />

                    </View>
                    {touched.credits && errors.credits && (
                      <Text style={styles.errorText}>{errors.credits?.value}</Text>
                    )}
                  </View>

                  {/* Net realised P&L */}
                  <View style={styles?.box}>
                    <View style={styles?.fieldBox}>
                      <TextInputCommon
                        style={[{ flexGrow: 1, width: 'auto' }]}
                        onFocus={onFocus}
                        editable={true}
                        placeholder={'Net realised P&L'}
                        require={true}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setFieldValue('netRealised', { ...values?.netRealised, value: text.replace(',', '') })}
                        value={values?.netRealised?.value}
                        onBlur={handleBlur(`netRealised`)}
                      />
                      <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'netRealised'} options={fieldsOption} onSelect={(item) => {
                        setFieldValue('netRealised', { ...values?.netRealised, type: item?.value })
                      }} value={values?.netRealised?.type} />

                    </View>
                    {touched.netRealised && errors.netRealised && (
                      <Text style={styles.errorText}>{errors.netRealised?.value}</Text>
                    )}
                  </View>

                  {/* Unrealised P&L */}
                  <View style={styles?.box}>
                    <View style={styles?.fieldBox}>
                      <TextInputCommon
                        style={[{ flexGrow: 1, width: 'auto' }]}
                        onFocus={onFocus}
                        editable={true}
                        placeholder={'Unrealised P&L'}
                        require={true}
                        keyboardType={'numeric'}
                        onChangeText={(text) => setFieldValue('unrealised', { ...values?.unrealised, value: text.replace(',', '') })}
                        value={values?.unrealised?.value}
                        onBlur={handleBlur(`unrealised`)}
                      />
                      <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'unrealised'} options={fieldsOption} onSelect={(item) => {
                        setFieldValue('unrealised', { ...values?.unrealised, type: item?.value })
                      }} value={values?.unrealised?.type} />

                    </View>
                    {touched.unrealised && errors.unrealised && (
                      <Text style={styles.errorText}>{errors.unrealised?.value}</Text>
                    )}
                  </View>

                  <Toast position='top' />

                  <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
                    {loading ? (
                      <ActivityIndicator color={COLOR.white} size={'large'} />
                    ) : (
                      <Text style={styles.buttonText}>Add User Detail</Text>
                    )}
                  </TouchableOpacity>

                </View>

              </ScrollView>
            </>
          )}
        </Formik>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default AddUserDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.screenBg,
    gap: hp(3)
  },
  datePickerViewStyle: {
    height: hp(6.4),
    borderRadius: hp(.2),
    borderWidth: hp(.17),
    borderColor: COLOR.borderGrey, textAlign: 'left',
    alignItems: 'center', flexDirection: 'row',
  },
  datePickerStyle: {
    fontSize: hp(1.68),
    color: COLOR.primaryBlue,
    paddingHorizontal: wp(2.6),
    paddingVertical: hp(1.1),
    letterSpacing: 1,
    fontFamily: FONTS.NunitoMedium, textAlignVertical: 'center'
  },
  dateText: {
    color: COLOR.textGrey, fontFamily: FONTS.NunitoRegular,
    fontSize: hp(1.6), textAlignVertical: 'center'
  },
  box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5) },
  fieldBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: wp(3) },

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
  errorText: { color: COLOR.errorColor, fontSize: hp(2), fontFamily: FONTS.NunitoRegular }
})