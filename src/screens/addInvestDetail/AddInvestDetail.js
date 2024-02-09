import Toast from 'react-native-toast-message';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Keyboard } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DropdownFloating from '../../components/common/DropDownFloating';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel';
import { COLOR } from '../../utils/color';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ValContext } from '../../context/Context';
import TextInputCommon from '../../components/common/TextInputFloating';
import { FONTS } from '../../utils/fontFamily';
import firestore from '@react-native-firebase/firestore';

const AddInvestDetail = () => {

    const [scrollOffset, setScrollOffset] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const { users, setUsers } = useContext(ValContext)

    const validationSchema = yup.object().shape({
        selectedUser: yup.object().nullable().required('Please select user'),
        bonds: yup.number().nullable().required('Bond is required'),
        AIO: yup.number().nullable().required('AIO is required'),
        stocks: yup.number().nullable().required('Stock Amount is required'),
        return_percent: yup.object().shape({
            type: yup.string().required('Please select an option from the dropdown'),
            value: yup.number().nullable().required('ROI is required'),
        }),
    });

    const handleInvestDetail = async (values, { resetForm }) => {

        try {
            setLoading(true);

            const investDocRef = firestore().collection('userInvestDetail').doc(values.selectedUser.id)

            const existingDoc = await investDocRef.get();

            let details = {
                selectedUser: values.selectedUser,
                bonds: values.bonds,
                AIO: values.AIO,
                stocks: values.stocks,
                return_percent: values.return_percent,
            }

            if (existingDoc.exists) {
                // If the document exists, update it
                await investDocRef.update(details);
            } else {
                // If the document doesn't exist, add a new one
                await investDocRef.set(details);
            }
            await firestore()
                .collection('users')
                .doc(values?.selectedUser?.id)
                .update({
                    invest_detail: details
                })
            resetForm();

            Toast.show({
                type: 'success',
                text1: 'Invest detail added successfully.',
                visibilityTime: 3000,
                text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
                swipeable: true,
                topOffset: scrollOffset,
            });

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: `Error while adding details.`,
                visibilityTime: 3000,
                swipeable: true,
                text1Style: { fontFamily: FONTS.NunitoMedium, fontSize: hp(1.3), color: COLOR.black, letterSpacing: wp(.1) },
                topOffset: scrollOffset,
            });
        } finally {
            Keyboard.dismiss()
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
            </TouchableOpacity>
            <Formik
                initialValues={{
                    bonds: null, selectedUser: null, AIO: null, stocks: null, return_percent: { type: fieldsOption[0]?.label, value: null, label: 'ROI' }
                }
                }

                validationSchema={validationSchema}
                onSubmit={handleInvestDetail}
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
                                {/* Select user */}

                                <View style={styles?.box}>

                                    <DropdownFloating placeholder={'Select User'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'selectedUser'} style={{ width: 'auto' }} options={users} onSelect={(item) => {
                                        setFieldValue('selectedUser', item)
                                    }} value={values?.selectedUser?.label} />

                                    {touched.selectedUser && errors.selectedUser && (
                                        <Text style={styles.errorText}>{errors.selectedUser}</Text>
                                    )}
                                </View>

                                {/* Invest Detail */}
                                {values?.selectedUser?.invest_detail &&
                                    <View style={styles.prevDetailBox}>
                                        <Text style={[styles.rowTitle, { fontFamily: FONTS.NunitoBold }]}>{values?.selectedUser?.name}'s previous invest detail</Text>
                                        <View style={styles.dataCard}>
                                            <View style={[styles.dataCardRow]}>
                                                <Text style={styles.rowTitle}>AIO</Text>
                                                <Text style={styles.valueText}>{values?.selectedUser?.invest_detail?.AIO}</Text>
                                            </View>
                                            <View style={[styles.dataCardRow]}>
                                                <Text style={styles.rowTitle}>Bonds</Text>
                                                <Text style={styles.valueText}>{values?.selectedUser?.invest_detail?.bonds}</Text>
                                            </View>
                                            <View style={[styles.dataCardRow]}>
                                                <Text style={styles.rowTitle}>Stocks</Text>
                                                <Text style={styles.valueText}>{values?.selectedUser?.invest_detail?.stocks}</Text>
                                            </View>
                                            <View style={[styles.dataCardRow]}>
                                                <Text style={styles.rowTitle}>ROI</Text>
                                                <Text style={[styles.valueText, {
                                                    color: values?.selectedUser?.invest_detail?.return_percent?.type == 'profit' ? COLOR.primaryGreen : COLOR.errorColor
                                                }]}>
                                                    {values?.selectedUser?.invest_detail?.return_percent?.type == 'profit' ? '+' : '-'}{values?.selectedUser?.invest_detail?.return_percent?.value}%
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                }

                                {/* Bond Amount */}

                                <View style={styles?.box}>
                                    <TextInputCommon
                                        onFocus={onFocus}
                                        style={[{ flexGrow: 1, width: 'auto' }]}
                                        editable={true}
                                        placeholder={'Bonds'}
                                        require={true}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => setFieldValue('bonds', text?.replace(',', ''))}
                                        value={values?.bonds}
                                        onBlur={() => handleBlur(`bonds`)}
                                    />

                                    {touched.bonds && errors.bonds && (
                                        <Text style={styles.errorText}>{errors.bonds}</Text>
                                    )}
                                </View>

                                {/* AIO Amount */}

                                <View style={styles?.box}>
                                    <TextInputCommon
                                        onFocus={onFocus}
                                        style={[{ flexGrow: 1, width: 'auto' }]}
                                        editable={true}
                                        placeholder={'AIO'}
                                        require={true}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => setFieldValue('AIO', text?.replace(',', ''))}
                                        value={values?.AIO}
                                        onBlur={() => handleBlur(`AIO`)}
                                    />

                                    {touched.AIO && errors.AIO && (
                                        <Text style={styles.errorText}>{errors.AIO}</Text>
                                    )}
                                </View>

                                {/* stocks Amount */}

                                <View style={styles?.box}>
                                    <TextInputCommon
                                        onFocus={onFocus}
                                        style={[{ flexGrow: 1, width: 'auto' }]}
                                        editable={true}
                                        placeholder={'Stocks'}
                                        require={true}
                                        keyboardType={'numeric'}
                                        onChangeText={(text) => setFieldValue('stocks', text?.replace(',', ''))}
                                        value={values?.stocks}
                                        onBlur={() => handleBlur(`stocks`)}
                                    />

                                    {touched.stocks && errors.stocks && (
                                        <Text style={styles.errorText}>{errors.stocks}</Text>
                                    )}
                                </View>

                                {/* Return Amount */}

                                <View style={styles?.box}>
                                    <View style={styles?.fieldBox}>
                                        <TextInputCommon
                                            onFocus={onFocus}
                                            style={[{ flexGrow: 1, width: 'auto' }]}
                                            editable={true}
                                            placeholder={'ROI'}
                                            require={true}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => setFieldValue('return_percent', { ...values?.return_percent, value: text.replace(',', '') })}
                                            value={values?.return_percent?.value}
                                            onBlur={() => handleBlur(`return_percent`)}
                                        />
                                        <DropdownFloating placeholder={'Select an option'} showDropdown={showDropdown} setShowDropdown={setShowDropdown} current={'return_percent'} options={fieldsOption} onSelect={(item) => {
                                            setFieldValue('return_percent', { ...values?.return_percent, type: item?.value })
                                        }} value={values?.return_percent?.type} />
                                    </View>

                                    {touched.return_percent && errors.return_percent && (
                                        <Text style={styles.errorText}>{errors.return_percent?.value}</Text>
                                    )}
                                </View>

                                <Toast position='top' />

                                <TouchableOpacity style={[styles.button, styles.commonInputStyle]} onPress={handleSubmit}>
                                    {loading ? (
                                        <ActivityIndicator color={COLOR.white} size={'large'} />
                                    ) : (
                                        <Text style={styles.buttonText}>Add Invest Detail</Text>
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

export default AddInvestDetail

const styles = StyleSheet.create({
    box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5) },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: COLOR.screenBg,
        gap: hp(3)
    },
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
    errorText: { color: COLOR.errorColor, fontSize: hp(1.68), fontFamily: FONTS.NunitoRegular },
    dataCard: {
        width: '100%', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'flex-start', backgroundColor: COLOR.white,
        justifyContent: 'space-between',flexWrap:'wrap'
    },
    rowTitle: { color: COLOR.black, textAlign: 'left', fontSize: hp(1.7), fontFamily: FONTS.NunitoMedium },

    valueText: { color: COLOR.primaryBlue, fontSize: hp(1.68), letterSpacing: wp(.1), fontFamily: FONTS.NunitoRegular, marginTop: hp(.5) },

    prevDetailBox: {
        flexDirection: 'column', width: '100%', gap: hp(1.8), height: 'auto', borderRadius: hp(.2), backgroundColor: COLOR.white,
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
})