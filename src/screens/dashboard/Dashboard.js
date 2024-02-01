import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLOR } from '../../utils/color'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel'
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { FONTS } from '../../utils/fontFamily'
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../components/customhook/useAuth'

const Dashboard = () => {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(moment())
  const [userDetails, setUserDetails] = useState(null);

  const { initializing, user, signIn, signOut } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      fetchUserDetails(selectedDate);
    }
  }, [user?.uid]);

  const fetchUserDetails = async (date) => {
    try {
      const userDetailDocRef = firestore()
        .collection('userDetail')
        .doc(user?.uid)
        .collection('details')
        .doc(date.format('YYYY-MM-DD'));

      const userDetailDoc = await userDetailDocRef.get();

      if (userDetailDoc.exists) {
        const data = userDetailDoc.data();
        console.log(data, ':: data ::');
        setUserDetails(data);
      } else {
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  function formatNumber(value) {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'L';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'k';
    } else {
      return value.toString();
    }
  }

  return (
    <SafeAreaView style={[{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }, styles?.container]}>

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
            {selectedDate?.format('DD-MM-YYYY')}
          </Text>
        </TouchableOpacity>
        <DatePicker
          theme='dark'
          modal
          open={open}
          date={selectedDate?.toDate()}
          mode={'date'}
          onConfirm={(date) => {
            setOpen(false);
            setSelectedDate(moment(date))
            fetchUserDetails(moment(date))
          }}
          maximumDate={moment().toDate()}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: hp(15) }} style={{ width: '100%' }}>

        <View style={styles.dataContainer}>
          {
            userDetails != null && Object?.keys(userDetails)?.map((item, index) => (
              <View key={index} style={[styles.dataCard, index == Object?.keys(userDetails)?.length - 1 && { marginRight: 'auto', marginLeft: wp(1) }]}>
                <Text style={styles.title}>{userDetails[item]?.label}</Text>
                <Text style={[styles?.text, userDetails[item]?.type == 'loss' && { color: COLOR.errorColor }]}>{
                  userDetails[item]?.type == 'loss' ? `-${formatNumber(userDetails[item]?.value)}` : formatNumber(userDetails[item]?.value)
                }</Text>
              </View>
            ))
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: hp(3),
    backgroundColor: COLOR.screenBg,
    gap: hp(3)
  },
  box: { width: '100%', display: 'flex', flexDirection: 'column', gap: hp(1.5) },

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
  text: { color: COLOR.black, fontSize: hp(2.4), fontFamily: FONTS.NunitoSemiBold, textAlign: 'left' },
  title: { fontFamily: FONTS.NunitoRegular, fontSize: hp(2.2), color: COLOR.black, textAlign: 'left' },
})