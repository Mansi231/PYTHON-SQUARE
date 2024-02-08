import { StyleSheet, View, TextInput, Image, Animated, Text } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../../pixel/index';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { FONTS } from '../../utils/fontFamily';
import { COLOR } from '../../utils/color';

const TextInputCommon = ({
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  placeholderTextColor,
  keyboardType,
  borderColor,
  icon,
  source,
  style,
  autoCapitalize,
  editable, label, showIcon, secureTextEntry
}) => {

  const [isFocused, setIsFocused] = useState(false)
  const translateY = useRef(new Animated.Value(0)).current;

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
    if (value?.length > 0) {
      startFloating()
    }
  }, [value])

  return (
    <View style={[styles.inputContainer, styles.commonInputStyle, { borderColor: isFocused ? COLOR.black : COLOR.borderGrey },style]}>
      <View style={[styles.mainView]}>
        <View style={[styles.PhoneNumberText,]}>
          <Animated.Text
            style={[
              styles.label,
              (isFocused) && { color: COLOR.lightBlack },
              {
                transform: [
                  {
                    translateY: translateY.interpolate({
                      inputRange: [-hp(1.9), 0],
                      outputRange: [-hp(2), 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {placeholder}
          </Animated.Text>
          <TextInput
            secureTextEntry={secureTextEntry}
            editable={editable}
            value={value}
            onChangeText={onChangeText}
            style={[styles.text, {  color: !isFocused && value ? COLOR.textGrey : COLOR.black }]}
            onFocus={() => { handleFocus(); onFocus ? onFocus() : null }}
            onBlur={() => { handleBlur(); onBlur ? onBlur() : null }}
            placeholderTextColor={placeholderTextColor}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
          />
        </View>
      </View>
      {showIcon && showIcon(isFocused)}
    </View>
  );
};

export default TextInputCommon;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: '100%',
  },
  PhoneNumberText: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
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
    // bottom: hp(1.1),
    fontSize: hp(1.68), fontFamily: FONTS.NunitoMedium, color: COLOR.textGrey, textAlign: 'center', width: 'auto',
    paddingHorizontal: wp(1), flex: 1, height: hp(3.1), alignSelf: 'center', textAlignVertical: 'center',
    backgroundColor: COLOR.screenBg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: COLOR.borderGrey,
    borderWidth: hp(.17),

  },
  commonInputStyle: {
    borderRadius: hp(.2),
    paddingHorizontal: wp(2),
    paddingRight: wp(3),
    height: hp(6.4),
  },
});


