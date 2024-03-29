import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Keyboard } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from
    '../../../pixel';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';

const Dropdown = ({ options, onSelect, value, style, current, showDropdown, setShowDropdown }) => {

    const handleSelect = (option) => {
        setShowDropdown(false);
        onSelect(option);
    };

    const handlePress = () =>{
        showDropdown === current ? setShowDropdown(false) : setShowDropdown(current)
        Keyboard.dismiss()
    }
    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={handlePress } activeOpacity={.5} style={styles.header}>
                <Text style={styles.headerText}>{value}</Text>
            </TouchableOpacity>

            {showDropdown === current && (
                <View style={[styles.dropdownContainer,showDropdown === current && {borderTopWidth:0,borderBottomWidth:0}]}>
                    <ScrollView
                        style={styles.dropdownScrollView}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps='handled'
                        indicatorStyle='black'
                    >
                        {
                            options.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => handleSelect(item)} style={[styles.option]}>
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            )
            }

        </View >
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
        height: hp(6.4)
    },
    dropdownContainer: {
        maxHeight: hp(20), // Set the maximum height for the dropdown container
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
    optionBox: { maxHeight: hp(20), borderWidth: hp(.12), borderColor: COLOR.borderGrey },
    option: {
        padding: hp(1.7),
        borderColor: COLOR.borderGrey,
        borderWidth: hp(.17),
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
    },
    headerText: {
        fontSize: hp(1.68),
        color: COLOR.primaryBlue,
        letterSpacing: 1,
        fontFamily: FONTS.NunitoMedium, textAlignVertical: 'center'
    },
    optionText: {
        color: COLOR.black,
        fontSize: hp(1.8),
        letterSpacing: wp(.2),
        fontFamily: FONTS.NunitoRegular
    },
});


export default Dropdown;
