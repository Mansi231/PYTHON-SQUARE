import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel'
import { COLOR } from '../../utils/color'
import { Formik } from 'formik'
import * as yup from 'yup';

const AddUserDetail = () => {

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required'),
  });

  const handleAddUserDetail = (values) => {

  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Formik
        initialValues={{ userId: '', password: '', name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUserDetail}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>

          </View>
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
    gap: hp(4)
  },

})