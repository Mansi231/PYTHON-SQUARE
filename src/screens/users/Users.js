import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useContext } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel'
import { COLOR } from '../../utils/color'
import { ValContext } from '../../context/Context'
import { FONTS } from '../../utils/fontFamily'
import { ROUTES } from '../../../services/routes'

const Users = ({ navigation }) => {

    const { users, setUsers } = useContext(ValContext)

    const renderUserItem = ({ item }) => {
        console.log(item, ':: item ::');
        return (
            <View style={[styles.tabelRow]}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.userId}</Text>
                {/* Add more cells for other user information */}
            </View>
        )
    };

    const handlePress = () => {
        navigation.navigate(ROUTES.ADD_USER)
    }
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(4), backgroundColor: COLOR.screenBg }}>
            <StatusBar translucent backgroundColor={COLOR.blue} barStyle={'light-content'} />

            <View style={styles.container}>
                <TouchableHighlight onPress={handlePress} style={styles.addUserBtn}>
                    <Text style={styles.btnText}>Add User +</Text>
                </TouchableHighlight>
                {/* User Table  */}
                <View style={{ justifyContent: 'flex-start', flexDirection: 'column', width: '100%', gap: hp(.5) }}>
                    <View style={[styles.row, styles.header]}>
                        <Text style={styles.headerText}>Name</Text>
                        <Text style={styles.headerText}>User Id</Text>
                        {/* Add more headers for other user information */}
                    </View>

                    {/* User Data */}
                    {users != null && users?.length > 0 &&
                        <View style={styles.tabelBody}>
                            <FlatList
                                data={users}
                                keyExtractor={(user) => user?.id?.toString()} // Assuming each user has a unique 'id'
                                renderItem={renderUserItem}
                                style={{ width: '100%' }}
                            />
                        </View>
                    }
                </View>
            </View>

        </SafeAreaView>
    )
}

export default Users

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: hp(3),
        backgroundColor: COLOR.screenBg,
        gap: hp(4)
    },

    addUserBtn: { paddingHorizontal: wp(3), paddingVertical: hp(1.5), backgroundColor: COLOR.primaryBlue, alignSelf: 'flex-end', borderRadius: hp(.3) },

    btnText: { color: COLOR.white, fontFamily: FONTS.NunitoRegular, letterSpacing: wp(.1), fontSize: hp(1.8) },

    header: {
        width: '100%', paddingVertical: hp(1.5), paddingHorizontal: wp(3), flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLOR.bgGrey, borderRadius: hp(.3), gap: wp(3)
    },
    tabelBody: { backgroundColor: COLOR.bgLightGrey, width: '100%' },

    tabelRow: { backgroundColor: COLOR.bgLightGrey, flexDirection: 'row', paddingVertical: hp(1.5), justifyContent: 'space-around', gap: wp(1), borderBottomColor: COLOR.borderGrey, borderBottomWidth: hp(.2) },
    cell: { color: COLOR.primaryBlue, fontFamily: FONTS.NunitoRegular, fontSize: hp(1.8) },
    headerText: { color: COLOR.black, fontFamily: FONTS.NunitoBold, fontSize: hp(2) },
})