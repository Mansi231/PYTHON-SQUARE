import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from
    '../../../pixel';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';

const Dropdown = ({ options, onSelect, value, style ,current ,showDropdown, setShowDropdown}) => {

    const handleSelect = (option) => {
        setShowDropdown(false);
        onSelect(option);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={() => {showDropdown === current ?setShowDropdown(false) : setShowDropdown(current)}} style={styles.header}>
                <Text style={styles.headerText}>{value}</Text>
            </TouchableOpacity>

            {showDropdown === current && (
                <View style={styles.dropdownContainer}>
                    <FlatList
                        data={options}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.option}>
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.value.toString()}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative', width: '40%'
    },
    header: {
        padding: hp(1.7),
        borderRadius: hp(.2),
        borderWidth: hp(.17),
        borderColor: COLOR.borderGrey,
        height: hp(6.4),
    },
    dropdownContainer: {
        maxHeight: hp(14), // Set the maximum height for the dropdown container
        borderColor: COLOR.borderGrey,
        borderRadius: hp(.2),
        borderWidth: hp(.17),
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: COLOR.white,

    },
    scrollView: {
        maxHeight: hp(4), // Set the maximum height for the dropdown options
    },
    option: {
        padding: hp(1.7),
        borderColor: COLOR.borderGrey,
        borderBottomWidth: hp(.17),
    },
    headerText: {
        fontSize: hp(1.68),
        color: COLOR.primaryBlue,
        letterSpacing: 1,
        fontFamily: FONTS.NunitoMedium, textAlignVertical: 'center'
    },
});


export default Dropdown;
