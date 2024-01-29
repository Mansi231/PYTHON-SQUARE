import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel'
import { COLOR } from '../../utils/color'
import { Formik } from 'formik'
import * as yup from 'yup';
import Dropdown from '../../components/common/DropDown'

const AddUserDetail = () => {

  const validationSchema = yup.object().shape({
    userId: yup.string().required('User Id is required'),
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required'),
  });

  const handleAddUserDetail = (values) => {

  }
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
    { label: 'Option 3', value: 4 },
    { label: 'Option 3', value: 5 },
    { label: 'Option 3', value: 6 },
    { label: 'Option 3', value: 7 },
    { label: 'Option 3', value: 8 },
    { label: 'Option 3', value: 9 },
    { label: 'Option 3', value: 10 },
    { label: 'Option 3', value: 11 },
    { label: 'Option 3', value: 12 },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
      <Formik
        initialValues={{ userId: '', password: '', name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleAddUserDetail}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.container}>
            <Dropdown options={options} onSelect={setSelectedOption} />
            <View style={styles.selectedOptionContainer}>
              <Text>Selected Option: {selectedOption?.label || 'None'}</Text>
            </View>
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