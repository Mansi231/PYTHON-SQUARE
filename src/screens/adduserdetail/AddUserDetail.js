import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
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

const AddUserDetail = () => {

  const [open, setOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const users = [
  //   { label: 'Option 1', value: 1 },
  //   { label: 'Option 2', value: 2 },
  //   { label: 'Option 3', value: 3 },
  //   { label: 'Option 3', value: 4 },
  //   { label: 'Option 3', value: 5 },
  //   { label: 'Option 3', value: 6 },
  //   { label: 'Option 3', value: 7 },
  //   { label: 'Option 3', value: 8 },
  //   { label: 'Option 3', value: 9 },
  //   { label: 'Option 3', value: 10 },
  //   { label: 'Option 3', value: 11 },
  //   { label: 'Option 3', value: 12 },
  // ];

  useEffect(() => {
    getUsers();
  }, [])

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
        .collection('details') // Add a subcollection for details
        .doc(values.selectedDate.format('YYYY-MM-DD')); // Use the selected date as the document ID

      await userDetailDocRef.set({
        realised: values.realised,
        charges: values.charges,
        credits: values.credits,
        netRealised: values.netRealised,
        unrealised: values.unrealised,
      });


      ToastAndroid.showWithGravityAndOffset('User detail added successfully.', ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100);
    } catch (error) {
      ToastAndroid.showWithGravityAndOffset('Error while adding details.', ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100);
      console.error('Error adding user details:', error);
    } finally {
      resetForm();
      setLoading(false);
    }

  }


  const fieldsOption = [{ label: 'profit', value: 'profit' }, { label: 'loss', value: 'loss' }]

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Formik
        initialValues={
          {
            selectedDate: moment(),
            selectedUser: null,
            realised: { type: fieldsOption[0]?.label, value: null ,label :'Realised P&L '},
            charges: { type: fieldsOption[0]?.label, value: null  ,label :'Charges & Taxes'},
            credits: { type: fieldsOption[0]?.label, value: null  ,label :'Other credits & debits'},
            netRealised: { type: fieldsOption[0]?.label, value: null  ,label :'Net realised P&L'},
            unrealised: { type: fieldsOption[0]?.label, value: null  ,label :'Unrealised P&L'},
          }
        }

        validationSchema={validationSchema}
        onSubmit={handleAddUserDetail}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, rese }) => (

          <>
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(15) }} style={{ width: '100%' }}>

              <View style={styles.container}>

                {/* Date Picker */}

                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Select Date
                  </Text>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.datePickerViewStyle,]}
                    onPress={() => {
                      setOpen(!open);
                    }}>
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
                  <Text style={styles?.dateText}>
                    Select User
                  </Text>
                  <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'selectedUser'} style={{ width: 'auto' }} options={users} onSelect={(item) => {
                    setFieldValue('selectedUser', item)
                  }} value={values?.selectedUser?.label || 'Select an option'} />

                  {touched.selectedUser && errors.selectedUser && (
                    <Text style={styles.errorText}>{errors.selectedUser}</Text>
                  )}
                </View>

                {/* Realised P&L  */}

                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Realised P&L
                  </Text>
                  <View style={styles?.fieldBox}>
                    <TextInput
                      style={[styles?.datePickerViewStyle]}
                      editable={true}
                      placeholder={'Realised P&L '}
                      require={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => setFieldValue('realised', { ...values?.realised, value: text })}
                      value={values?.realised?.value}
                      onBlur={handleBlur(`realised`)}
                    />
                    <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'realised'} options={fieldsOption} onSelect={(item) => {
                      setFieldValue('realised', { ...values?.charges, type: item?.value })
                    }} value={values?.realised?.type || 'Select an option'} />

                  </View>
                  {touched.realised && errors.realised && (
                    <Text style={styles.errorText}>{errors.realised?.value}</Text>
                  )}
                </View>

                {/* Charges & Taxes */}
                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Charges & Taxes
                  </Text>
                  <View style={styles?.fieldBox}>
                    <TextInput
                      style={[styles?.datePickerViewStyle]}
                      editable={true}
                      placeholder={'Charges & Taxes '}
                      require={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => setFieldValue('charges', { ...values?.charges, value: text })}
                      value={values?.charges?.value}
                      onBlur={handleBlur(`charges`)}
                    />
                    <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'charges'} options={fieldsOption} onSelect={(item) => {
                      setFieldValue('charges', { ...values?.charges, type: item?.value })
                    }} value={values?.charges?.type || 'Select an option'} />

                  </View>
                  {touched.charges && errors.charges && (
                    <Text style={styles.errorText}>{errors.charges?.value}</Text>
                  )}
                </View>

                {/* Other credits & debits  */}
                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Other credits & debits
                  </Text>
                  <View style={styles?.fieldBox}>
                    <TextInput
                      style={[styles?.datePickerViewStyle]}
                      editable={true}
                      placeholder={'Other credits & debits'}
                      require={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => setFieldValue('credits', { ...values?.credits, value: text })}
                      value={values?.credits?.value}
                      onBlur={handleBlur(`credits`)}
                    />
                    <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'credits'} options={fieldsOption} onSelect={(item) => {
                      setFieldValue('credits', { ...values?.credits, type: item?.value })
                    }} value={values?.credits?.type || 'Select an option'} />

                  </View>
                  {touched.credits && errors.credits && (
                    <Text style={styles.errorText}>{errors.credits?.value}</Text>
                  )}
                </View>

                {/* Net realised P&L */}
                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Net realised P&L
                  </Text>
                  <View style={styles?.fieldBox}>
                    <TextInput
                      style={[styles?.datePickerViewStyle]}
                      editable={true}
                      placeholder={'Net realised P&L'}
                      require={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => setFieldValue('netRealised', { ...values?.netRealised, value: text })}
                      value={values?.netRealised?.value}
                      onBlur={handleBlur(`netRealised`)}
                    />
                    <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'netRealised'} options={fieldsOption} onSelect={(item) => {
                      setFieldValue('netRealised', { ...values?.netRealised, type: item?.value })
                    }} value={values?.netRealised?.type || 'Select an option'} />

                  </View>
                  {touched.netRealised && errors.netRealised && (
                    <Text style={styles.errorText}>{errors.netRealised?.value}</Text>
                  )}
                </View>

                {/* Unrealised P&L */}
                <View style={styles?.box}>
                  <Text style={styles?.dateText}>
                    Unrealised P&L
                  </Text>
                  <View style={styles?.fieldBox}>
                    <TextInput
                      style={[styles?.datePickerViewStyle]}
                      editable={true}
                      placeholder={'Unrealised P&L'}
                      require={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => setFieldValue('unrealised', { ...values?.unrealised, value: text })}
                      value={values?.unrealised?.value}
                      onBlur={handleBlur(`unrealised`)}
                    />
                    <Dropdown showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'unrealised'} options={fieldsOption} onSelect={(item) => {
                      setFieldValue('unrealised', { ...values?.unrealised, type: item?.value })
                    }} value={values?.unrealised?.type || 'Select an option'} />

                  </View>
                  {touched.unrealised && errors.unrealised && (
                    <Text style={styles.errorText}>{errors.unrealised?.value}</Text>
                  )}
                </View>

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
    </SafeAreaView>
  )
}

export default AddUserDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(3),
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