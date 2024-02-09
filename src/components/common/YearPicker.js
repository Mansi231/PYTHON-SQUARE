import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { COLOR } from '../../utils/color';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../../pixel';
import { FONTS } from '../../utils/fontFamily';
import moment from 'moment'

const YearPicker = ({ modalVisible, setModalVisible, selectedYear, setSelectedYear, fetchUserDetails }) => {

    const [year, setYear] = useState(selectedYear)

    const years = Array.from({ length: (moment().get('year') + 1 ) - 2023 }, (_, index) => moment().get('year') - index);

    const renderYearItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.yearItem, item === year && styles.selectedYear]}
            onPress={() => {
                setYear(item)
            }}>
            <Text style={[styles.yearText, item === year && styles.selectedYearText]}>{item}</Text>
        </TouchableOpacity>
    );

    const handleConfirm = () => {
        fetchUserDetails(year)
        setModalVisible(false);
        setSelectedYear(year)
    }

    const handleCancel = () => {
        setSelectedYear(moment().get('year'))
        setModalVisible(false)
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText}>Select Year</Text>
                        <FlatList
                            style={{ width: '100%' }}
                            data={years}
                            renderItem={renderYearItem}
                            keyExtractor={(item) => item.toString()}
                        />
                        <View style={styles.footer}>
                            <TouchableOpacity activeOpacity={1} onPress={() => handleCancel()}>
                                <Text style={styles.footerText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={() => handleConfirm()}>
                                <Text style={styles.footerText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Text style={styles.selectedYear}>Selected Year: {selectedYear}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.black80,
    },
    modalContent: {
        backgroundColor: COLOR.black30,
        width: '60%', // Adjust as needed
        maxHeight: hp(25),
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: { paddingBottom: hp(1.5), paddingTop: hp(1.5), alignSelf: 'baseline', paddingHorizontal: wp(5), fontFamily: FONTS.NunitoMedium, fontSize: hp(1.7), color: COLOR.offWhite, borderBottomColor: COLOR.sepratorGrey, borderBottomWidth: hp(.1), width: '100%' },
    yearItem: {
        paddingVertical: hp(1.3),
        borderBottomWidth: 1,
        borderBottomColor: COLOR.sepratorGrey,
        paddingHorizontal: wp(2),
        color: COLOR.textGrey, width: '50%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    yearText: {
        fontSize: hp(1.68),
        color: COLOR.sepratorGrey,
        fontFamily: FONTS.NunitoRegular, letterSpacing: wp(.1)
    },
    selectedYearText: { color: COLOR.white },
    selectedYear: { backgroundColor: COLOR.black30 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: wp(5), borderTopColor: COLOR.sepratorGrey, borderTopWidth: hp(.1), paddingVertical: hp(1.5) },
    footerText: { color: COLOR.white, fontFamily: FONTS.NunitoMedium, fontSize: hp(1.7) },
});

export default YearPicker;
