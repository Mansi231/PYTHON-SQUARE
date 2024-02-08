import Toast from 'react-native-toast-message';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ToastAndroid, ActivityIndicator, StatusBar, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { COLOR } from '../../utils/color'
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import { Formik } from 'formik'
import * as yup from 'yup';
import moment from 'moment'
import DatePicker from 'react-native-date-picker';
import { FONTS } from '../../utils/fontFamily';
import DropdownFloating from '../../components/common/DropDownFloating';
import { ValContext } from '../../context/Context';
import TextInputCommon from '../../components/common/TextInputFloating';
import firestore from '@react-native-firebase/firestore';

const AddUserInfo = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);

    const { users, setUsers } = useContext(ValContext)

    const fieldsOption = [{ label: 'profit', value: 'profit' }, { label: 'loss', value: 'loss' }]

    const validationSchema = yup.object().shape({
        selectedDate: yup.date().required('Target Date is required'),
        selectedUser: yup.object().nullable().required('Please select user'),
        invested_amount: yup.number().nullable().required('Amount is required'),
        profit_amount: yup.number().nullable().required('Profit/loss amount is required'),
    });

    const onFocus = () => {
        setShowDropdown(false)
    }

    const handleAddUserInfo = async (values) => {

        let returnValue = calculateROI(values?.invested_amount,values?.profit_amount,values?.type)

        let year = values?.selectedDate?.get('year')

        try {
            setLoading(true);

            const userDetailDocRef = firestore()
                .collection('userDetail')
                .doc(values.selectedUser.id)
                .collection(`${year}`)
                .doc(values.selectedDate.format('YYYY-MM-DD'));

            const existingDoc = await userDetailDocRef.get();

            if (existingDoc.exists) {
                // If the document exists, update it
                await userDetailDocRef.update({
                    invested_amount: values.invested_amount,
                    profit_amount: values.profit_amount,
                    type: values.type,
                    selectedDate: moment(values.selectedDate).format('YYYY-MM-DD'),
                    selectedUser: values.selectedUser,
                    return:returnValue
                });
            } else {
                // If the document doesn't exist, add a new one
                await userDetailDocRef.set({
                    invested_amount: values.invested_amount,
                    profit_amount: values.profit_amount,
                    type: values.type,
                    selectedDate: moment(values.selectedDate).format('YYYY-MM-DD'),
                    selectedUser: values.selectedUser,
                    return:returnValue
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
            setLoading(false);
        }

    }

    const calculateROI = (investedAmount, profit, type) => {
        // Calculate ROI
        let amount = type == 'profit' ? profit : -profit

        const ROI = (amount / investedAmount) * 100;

        // Check if ROI is positive (profit) or negative (loss)
        if (ROI >= 0) {
            return ROI.toFixed(2)
        } else {
            return Math.abs(ROI).toFixed(2)
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
            <StatusBar translucent backgroundColor={COLOR.blue} barStyle={'light-content'} />

            <TouchableOpacity activeOpacity={1} onPress={() => setShowDropdown(false)}>
                <Formik
                    initialValues={{ selectedDate: moment(), selectedUser: null, invested_amount: null, profit_amount: null, type: 'profit' }}
                    validationSchema={validationSchema}
                    onSubmit={handleAddUserInfo}
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
                                contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(15), paddingTop: hp(1) }} style={{ width: '100%' }}>

                                <View style={styles.container}>

                                    {/* Date Picker */}

                                    <View style={styles?.box}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={[styles.datePickerViewStyle, open && { borderColor: COLOR.black }]}
                                            onPress={() => {
                                                setOpen(!open);
                                            }}>
                                            <Text style={[styles.dateLabelText, open && { color: COLOR.black }]}>Select Date</Text>
                                            <Text
                                                style={[styles.datePickerStyle, open && { color: COLOR.black }]}>
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

                                    {/* Invested Amount */}

                                    <View style={styles?.box}>
                                        <TextInputCommon
                                            onFocus={onFocus}
                                            style={[{ flexGrow: 1, width: 'auto' }]}
                                            editable={true}
                                            placeholder={'Invested Amount'}
                                            require={true}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => setFieldValue('invested_amount', text?.replace(',', ''))}
                                            value={values?.invested_amount}
                                            onBlur={() => handleBlur(`invested_amount`)}
                                        />

                                        {touched.invested_amount && errors.invested_amount && (
                                            <Text style={styles.errorText}>{errors.invested_amount}</Text>
                                        )}
                                    </View>

                                    {/* Profit / Loss */}

                                    <View style={styles?.box}>
                                        <TextInputCommon
                                            onFocus={onFocus}
                                            style={[{ flexGrow: 1, width: 'auto' }]}
                                            editable={true}
                                            placeholder={'Profit / Loss Amount'}
                                            require={true}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => setFieldValue('profit_amount', text?.replace(',', ''))}
                                            value={values?.profit_amount}
                                            onBlur={() => handleBlur(`profit_amount`)}
                                        />

                                        {touched.profit_amount && errors.profit_amount && (
                                            <Text style={styles.errorText}>{errors.profit_amount}</Text>
                                        )}
                                    </View>

                                    {/* Type Dropdown */}

                                    <View style={styles?.box}>
                                        <DropdownFloating style={{ width: '100%' }} placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'type'} options={fieldsOption} onSelect={(item) => {
                                            setFieldValue('type', item?.value)
                                        }} value={values?.type} />

                                    </View>

                                    {/* return percent */}

                                    <View style={styles?.box}>
                                        <Text style={styles.dateText}>Return :
                                            {(values?.invested_amount && values?.profit_amount) ? <Text style={[styles.dateText, { color: values?.type == 'profit' ? COLOR.primaryGreen : COLOR.errorColor }]}>
                                                {values?.type == 'profit' ? ' +' : ' -'}{calculateROI(values?.invested_amount, values?.profit_amount, values?.type)} %</Text> : <Text style={[styles.dateText, { color: COLOR.black }]}> 0 %</Text>}
                                        </Text>
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

export default AddUserInfo

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
        color: COLOR.textGrey,
        paddingHorizontal: wp(2.6),
        paddingVertical: hp(1.1),
        letterSpacing: 1,
        fontFamily: FONTS.NunitoMedium, textAlignVertical: 'center'
    },
    dateText: {
        color: COLOR.textGrey, fontFamily: FONTS.NunitoRegular,
        fontSize: hp(1.6), textAlignVertical: 'center'
    },
    dateLabelText: { position: 'absolute', top: -hp(1.35), backgroundColor: COLOR.screenBg, zIndex: 9000, left: wp(1), paddingHorizontal: wp(1), color: COLOR.textGrey, fontFamily: FONTS.NunitoMedium, fontSize: hp(1.68), },

    box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5) },
    fieldBox: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: wp(3) },

    button: {
        backgroundColor: COLOR.blue,
        paddingVertical: hp(1.5),
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
        letterSpacing: wp(.2),
        fontSize: hp(2.2),
    },

    commonInputStyle: {
        borderRadius: hp(.5),
        paddingHorizontal: wp(2),
        paddingRight: wp(3),
    },
    errorText: { color: COLOR.errorColor, fontSize: hp(1.68), fontFamily: FONTS.NunitoRegular }
})