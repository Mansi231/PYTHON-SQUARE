import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Keyboard, Animated, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from
    '../../../pixel';
import { COLOR } from '../../utils/color';
import { FONTS } from '../../utils/fontFamily';

const DropdownFloating = ({ options, onSelect, value, style, current, showDropdown, setShowDropdown, placeholder }) => {


    const [isFocused, setIsFocused] = useState(false)
    const translateY = useRef(new Animated.Value(0)).current;


    const handleSelect = (option) => {
        setShowDropdown(false);
        onSelect(option);
    };

    const handlePress = () => {
        if (showDropdown === current) { setIsFocused(false); stopFloating() }
        else { setIsFocused(true); startFloating() }
        showDropdown === current ? setShowDropdown(false) : setShowDropdown(current)
        Keyboard.dismiss()
    }


    const startFloating = () => {
        Animated.timing(translateY, {
            toValue: -hp(2.9),
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    const stopFloating = () => {
        Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    const handleFocus = () => { startFloating(); setIsFocused(true) };

    const handleBlur = () => {
        if (!value) {
            stopFloating()
        }
        setIsFocused(false)
    };

    useEffect(() => {
        if (value && value?.length > 0) {
            startFloating()
        }
        else if (showDropdown !== current) stopFloating()
    }, [value, showDropdown])

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={[styles.inputContainer, styles.commonInputStyle, { borderColor: showDropdown === current ? COLOR.black : COLOR.borderGrey }, style]}>
                <Animated.Text
                    style={[
                        styles.label,
                        (showDropdown === current) && { color: COLOR.lightBlack, paddingHorizontal: wp(1), left: wp(1) },
                        (!(showDropdown === current) && value) && { bottom: hp(1.7), paddingHorizontal: wp(1), left: wp(1) },
                        {
                            transform: [
                                {
                                    translateY: translateY.interpolate({
                                        inputRange: [-hp(1.75), 0],
                                        outputRange: [-hp(2), 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    {placeholder}
                </Animated.Text>
                <Text style={[styles.headerText, (!(showDropdown === current) && value) && { color: COLOR.textGrey }]}>{value}</Text>
            </TouchableOpacity>

            {showDropdown === current && (
                <View style={[styles.dropdownContainer, showDropdown === current && { borderColor: COLOR.black, }]}>
                    <ScrollView
                        style={styles.dropdownScrollView}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps='handled'
                        indicatorStyle='black'
                    >
                        {
                            (options && options?.length >0) ? options.map((item, index) => (
                                <TouchableOpacity key={index} onPress={() => handleSelect(item)} style={[styles.option]}>
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )) : <TouchableOpacity style={[styles.option]}>
                                <Text style={styles.optionText}>No Users Found</Text>
                            </TouchableOpacity>
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
        marginTop: hp(.1)
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
        color: COLOR.black,
        letterSpacing: 1,
        fontFamily: FONTS.NunitoMedium, textAlignVertical: 'center', alignSelf: 'flex-start'
    },
    optionText: {
        color: COLOR.black,
        fontSize: hp(1.8),
        letterSpacing: wp(.2),
        fontFamily: FONTS.NunitoRegular
    },

    // floated styles

    text: {
        height: '100%',
        fontSize: hp(2.1),
        color: COLOR.borderLighGrey,
        width: '100%',
        paddingHorizontal: wp(1),
        fontFamily: FONTS.Avenir,
        color: COLOR.textGray,
        justifyContent: 'center',
        alignItems: 'center', textAlignVertical: 'center', marginVertical: hp(0.4), paddingBottom: hp(.8)

    },
    Icons: {
        resizeMode: 'contain',
        height: hp(3),
        width: wp(5),
    },
    label: {
        position: 'absolute',
        left: 0,
        top: hp(1.5),
        fontSize: hp(1.68), fontFamily: FONTS.NunitoMedium, color: COLOR.textGrey, textAlign: 'center', width: 'auto',
        paddingHorizontal: hp(1.7), flex: 1, height: hp(3.1), alignSelf: 'center', textAlignVertical: 'center',
        backgroundColor: COLOR.screenBg,
    },
    inputContainer: {
        alignItems: 'center',
        width: '100%',
        borderColor: COLOR.borderGrey,
        borderWidth: hp(.17),
        justifyContent: 'center'
    },
    commonInputStyle: {
        borderRadius: hp(.2),
        paddingHorizontal: wp(2),
        paddingRight: wp(3),
        height: hp(6.4),
    },
});


export default DropdownFloating;
