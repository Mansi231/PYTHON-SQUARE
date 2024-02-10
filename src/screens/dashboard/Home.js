import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR } from '../../utils/color'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel'
import moment from 'moment'
import { FONTS } from '../../utils/fontFamily'
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../components/customhook/useAuth'
import { ROUTES } from '../../../services/routes'
import { ValContext } from '../../context/Context'
import YearPicker from '../../components/common/YearPicker'

const Home = ({ navigation }) => {

    const [open, setOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(moment().get('year'))
    const [userDetails, setUserDetails] = useState(null);

    const { loggedInUser } = useContext(ValContext)

    const fetchUserDetails = async (year) => {
        try {

            let userDetailsByMonth = [];

            const currentYear = moment().year();
            const currentMonth = moment().month();

            if (currentYear === year) {
                userDetailsByMonth = Array.from({ length: currentMonth + 1 }, (_, i) => {
                    const month = moment().month(i).format('MMMM');
                    return { month, data: [] };
                });
            } else {
                userDetailsByMonth = Array.from({ length: 12 }, (_, i) => {
                    const month = moment().month(i).format('MMMM');
                    return { month, data: [] };
                });
            }
            const userDetailDocRef = firestore()
                .collection('userDetail')
                .doc(loggedInUser?.uid)
                .collection(`${year}`);

            userDetailDocRef.onSnapshot(async (querySnapshot) => {

                const updatedUserDetailsByMonth = [...userDetailsByMonth];

                await querySnapshot.forEach((doc) => {
                    const currentYear = moment().year();
                    const currentMonth = moment().month();
                    if (currentYear === year) {
                        userDetailsByMonth = Array.from({ length: currentMonth + 1 }, (_, i) => {
                            const month = moment().month(i).format('MMMM');
                            return { month, data: [] };
                        });
                    } else {
                        userDetailsByMonth = Array.from({ length: 12 }, (_, i) => {
                            const month = moment().month(i).format('MMMM');
                            return { month, data: [] };
                        });
                    }

                    const monthIndex = moment(doc.data()?.selectedDate, 'YYYY-MM-DD').month();
                    const monthData = updatedUserDetailsByMonth[monthIndex]?.data || [];

                    const existingDataIndex = monthData.findIndex((item) => item.id === doc.id);

                    if (existingDataIndex !== -1) {
                        // Update existing data
                        monthData[existingDataIndex] = doc.data();
                    } else {
                        // Add new data
                        monthData.push(doc.data());
                    }

                    updatedUserDetailsByMonth[monthIndex] = {
                        month: moment(doc.data()?.selectedDate, 'YYYY-MM-DD').format('MMMM'),
                        data: monthData,
                    };
                });
                setUserDetails(updatedUserDetailsByMonth);
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };


    useEffect(() => {
        if (loggedInUser?.uid) {
            fetchUserDetails(selectedYear);
        }
    }, [loggedInUser?.uid]);

    function formatNumber(value) {
        if (value >= 1e9) {
            return (value / 1e9).toFixed(2) + 'B'; // Billion
        } else if (value >= 1e7) {
            return (value / 1e7).toFixed(2) + 'Cr'; // Crore
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(2) + 'M'; // Million
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(2) + 'K'; // Thousand
        } else {
            return value.toString();
        }
    }

    return (
        <SafeAreaView style={[{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }, styles?.container]}>

            <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />

            <View style={styles?.box}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.datePickerViewStyle, open && { borderColor: COLOR.black }]}
                    onPress={() => {
                        setOpen(!open);
                    }}>
                    <Text style={[styles.dateLabelText, open && { color: COLOR.black }]}>Select Year</Text>
                    <Text
                        style={[styles.datePickerStyle, open && { color: COLOR.black }]}>
                        {selectedYear}
                    </Text>
                </TouchableOpacity>
                <YearPicker modalVisible={open} setModalVisible={setOpen} setSelectedYear={setSelectedYear} selectedYear={selectedYear} fetchUserDetails={fetchUserDetails} />


            </View>

            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, height: 'auto', paddingBottom: hp(2) }} style={{ width: '100%' }}>
                <View style={styles.dataContainer}>
                    {
                        userDetails != null ?
                            userDetails?.map((item, index) => {

                                const totalInvestment = item.data.reduce((acc, curr) => acc + (Number(curr.invested_amount) || 0), 0);

                                const totalProfit = item?.data?.filter(({ type }, index) => type == 'profit')?.reduce((acc, curr) => acc + (Number(curr.profit_amount) || 0), 0);

                                const totalLoss = item?.data?.filter(({ type }, index) => type == 'loss')?.reduce((acc, curr) => acc + (Number(curr.profit_amount) || 0), 0);

                                const totalReturn = totalProfit - totalLoss;

                                const returnPercentage = totalReturn !== 0 && ((totalReturn / totalInvestment) * 100).toFixed(2)

                                return (
                                    <View style={styles?.dataCard} key={index}>
                                        <Text style={styles.month}>{item.month}</Text>
                                        <View style={styles.dataCardRow}>
                                            <Text style={styles.rowTitle}>
                                                Invest
                                            </Text>
                                            <Text style={styles.valueText}>{formatNumber(totalInvestment)} ₹</Text>
                                        </View>
                                        <View style={styles.dataCardRow}
                                        >
                                            <Text style={styles.rowTitle}>
                                                Profit
                                            </Text>
                                            <Text style={styles.valueText}>{formatNumber(totalProfit)} ₹</Text>
                                        </View>
                                        <View style={styles.dataCardRow}
                                        >
                                            <Text style={styles.rowTitle}>
                                                Loss
                                            </Text>
                                            <Text style={[styles.valueText]}>{formatNumber(totalLoss)} ₹</Text>
                                        </View>
                                        <View style={styles.dataCardRow}
                                        >
                                            <Text style={styles.rowTitle}>
                                                Return
                                            </Text>

                                            {returnPercentage ? <Text style={[styles.valueText, { color: returnPercentage < 0 ? COLOR.errorColor : COLOR.primaryGreen }]}>

                                                {returnPercentage > 0 && '+'}{returnPercentage} %</Text> :

                                                <Text style={[styles.valueText, { color: COLOR.textGrey }]}>N/A</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                            : <View style={styles?.header}><Text style={styles.noDataText}>{`No Data Found for Year ${selectedYear}`}</Text></View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: COLOR.screenBg,
        gap: hp(3)
    },
    logoutContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: wp(2) },
    logoutText: { fontFamily: FONTS.InterMedium, fontSize: hp(2), color: COLOR.primaryGreen, textAlign: 'left' },

    noDataText: { color: COLOR.textGrey, fontSize: hp(1.7), textAlign: 'center', fontFamily: FONTS.NunitoRegular, letterSpacing: wp(.1) },
    header: { width: '100%', backgroundColor: COLOR.white, paddingVertical: hp(2) },

    box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5), backgroundColor: COLOR.white, paddingTop: hp(2), paddingHorizontal: wp(2.5) },

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
    dateLabelText: { position: 'absolute', top: -hp(1.35), backgroundColor: COLOR.white, zIndex: 9000, left: wp(1), paddingHorizontal: wp(1), color: COLOR.textGrey, fontFamily: FONTS.NunitoMedium, fontSize: hp(1.68), },
    dataContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    dataCard: {
        height: 'auto', width: '48%', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start', backgroundColor: COLOR.white,
        gap: hp(2),
        borderRadius: hp(.8),
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.8),
    },
    dataCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', alignSelf: 'center' },
    rowTitle: { color: COLOR.black, textAlign: 'left', fontSize: hp(1.7), fontFamily: FONTS.NunitoMedium },
    valueText: { color: COLOR.primaryBlue, fontSize: hp(1.68), letterSpacing: wp(.1), fontFamily: FONTS.NunitoRegular },

    text: { color: COLOR.primaryGreen, fontSize: hp(2.4), fontFamily: FONTS.NunitoSemiBold, textAlign: 'left' },

    title: { fontFamily: FONTS.NunitoRegular, fontSize: hp(2.2), color: COLOR.black, textAlign: 'left' },

    dataCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', alignSelf: 'center' },

    rowTitle: { color: COLOR.black, textAlign: 'left', fontSize: hp(1.9), fontFamily: FONTS.NunitoMedium },

    month: { color: COLOR.black, fontSize: hp(2.1), fontFamily: FONTS.NunitoBold, borderBottomColor: COLOR.borderGrey, borderBottomWidth: hp(.1), width: '100%', textAlign: 'center', paddingBottom: hp(1.3) },

    valueText: { color: COLOR.black, fontSize: hp(1.8), letterSpacing: wp(.1), fontFamily: FONTS.NunitoRegular },
})