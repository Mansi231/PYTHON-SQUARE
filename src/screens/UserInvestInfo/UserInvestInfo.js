import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ValContext } from '../../context/Context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../../pixel'
import { COLOR } from '../../utils/color'
import { FONTS } from '../../utils/fontFamily'

const UserInvestInfo = ({ navigation }) => {

  const { loggedInUser, userInvestDetail } = useContext(ValContext)

  return (
    <SafeAreaView style={[{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }, styles?.container]}>

      <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />

      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, height: 'auto' }} style={{ width: '100%' }}>
        {userInvestDetail && <View style={styles.dataContainer}>
          <View style={styles.dataCard}>
            <View style={[styles.dataCardRow]}>
              <Text style={styles.rowTitle}>AIF</Text>
              <Text style={styles.valueText}>{userInvestDetail?.AIF}</Text>
            </View>
          </View>
          <View style={styles.dataCard}>
            <View style={[styles.dataCardRow]}>
              <Text style={styles.rowTitle}>Bonds</Text>
              <Text style={styles.valueText}>{userInvestDetail?.bonds}</Text>
            </View>
          </View>
          <View style={styles.dataCard}>
            <View style={[styles.dataCardRow]}>
              <Text style={styles.rowTitle}>Stocks</Text>
              <Text style={styles.valueText}>{userInvestDetail?.stocks}</Text>
            </View>
          </View>
          <View style={styles.dataCard}>
            <View style={[styles.dataCardRow]}>
              <Text style={styles.rowTitle}>ROI</Text>
              <Text style={[styles.valueText, { color: userInvestDetail?.return_percent?.type == 'profit' ? COLOR.primaryGreen : COLOR.errorColor }]}>{userInvestDetail?.return_percent?.type == 'profit' ? '+' : '-'}{userInvestDetail?.return_percent?.value}%</Text>
            </View>
          </View>
        </View>}
      </ScrollView>

    </SafeAreaView>
  )
}

export default UserInvestInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.screenBg,
    gap: hp(3)
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
    height: 'auto', width: '100%', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'flex-start', backgroundColor: COLOR.white,
    gap: hp(2),
    borderRadius: hp(.1),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  dataCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', alignSelf: 'center' },

  rowTitle: { color: COLOR.black, textAlign: 'left', fontSize: hp(1.7), fontFamily: FONTS.NunitoMedium },
  valueText: { color: COLOR.primaryBlue, fontSize: hp(1.68), letterSpacing: wp(.1), fontFamily: FONTS.NunitoRegular },
})