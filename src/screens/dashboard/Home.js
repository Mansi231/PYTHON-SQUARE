import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR } from '../../utils/color'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { FONTS } from '../../utils/fontFamily'
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../components/customhook/useAuth'
import { ROUTES } from '../../../services/routes'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { ValContext } from '../../context/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import YearPicker from '../../components/common/YearPicker'

const Home = ({ navigation }) => {

    const [open, setOpen] = useState(false)
    const [selectedYear, setSelectedYear] = useState(moment().get('year'))
    const [userDetails, setUserDetails] = useState(null);

    const { signOut } = useAuth();
    const { loggedInUser, setLoggedInUser } = useContext(ValContext)

    const fetchUserDetails = async (year) => {

        try {
            const userDetailDocRef = firestore()
                .collection('userDetail')
                .doc(loggedInUser?.uid)
                .collection(`${year}`);

            const querySnapshot = await userDetailDocRef.get();
            const dataArray = [];

            // Iterate over each month within the year collection
            querySnapshot.forEach(async (monthDoc) => {
                const month = monthDoc.id;
                const monthData = [];

                // Fetch documents within the current month
                const monthQuerySnapshot = await monthDoc.ref.collection(month).get();

                monthQuerySnapshot.forEach((doc) => {
                    // Push data of each document within the month to monthData array
                    monthData.push(doc.data());
                });

                // Push monthData array to dataArray for each month
                dataArray.push({ month, data: monthData });
            });

            setUserDetails(dataArray);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        if (loggedInUser?.uid) {
            fetchUserDetails(selectedYear);
        }
    }, [loggedInUser?.uid]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            await signOut();
            navigation.replace(ROUTES.LOGIN);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <SafeAreaView style={[{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }, styles?.container]}>

            <StatusBar translucent backgroundColor={COLOR.blue} barStyle={'dark-content'} />

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: COLOR.primaryBlue, fontSize: hp(2), fontFamily: FONTS.NunitoBold, textAlign: 'left', alignSelf: 'flex-start' }}>{loggedInUser?.email?.split('@')[0]}</Text>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={styles?.logoutContainer}>
                    <AntDesign name={'logout'} size={hp(2)} color={COLOR.primaryGreen} />
                    <Text style={styles?.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

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
                contentContainerStyle={{ flexGrow: 1, height: 'auto' }} style={{ width: '100%' }}>
                <View style={styles.dataContainer}>
                    {
                        userDetails != null ?
                            userDetails?.map((item, index) => {
                                const date = moment(item.selectedDate, 'YYYY-MM-DD');
                                const monthName = date.format('MMMMM');
                                return (
                                    <View style={styles?.dataCard}>
                                        <Text>{monthName}</Text>
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
        paddingVertical: hp(3),
        backgroundColor: COLOR.screenBg,
        gap: hp(3)
    },
    logoutContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: wp(2) },
    logoutText: { fontFamily: FONTS.InterMedium, fontSize: hp(2), color: COLOR.primaryGreen, textAlign: 'left' },

    noDataText: { color: COLOR.textGrey, fontSize: hp(1.7), textAlign: 'center', fontFamily: FONTS.NunitoRegular, letterSpacing: wp(.1) },
    header: { width: '100%', backgroundColor: COLOR.white, paddingVertical: hp(2) },
    box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5), backgroundColor: COLOR.white, paddingVertical: hp(2), paddingHorizontal: wp(2.5) },

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
        height: hp(20), width: '48%', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', backgroundColor: COLOR.white,
        gap: hp(2),
        borderRadius: hp(.8),
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
    },
    text: { color: COLOR.primaryGreen, fontSize: hp(2.4), fontFamily: FONTS.NunitoSemiBold, textAlign: 'left' },
    title: { fontFamily: FONTS.NunitoRegular, fontSize: hp(2.2), color: COLOR.black, textAlign: 'left' },
})