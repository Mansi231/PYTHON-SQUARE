import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { heightPercentageToDP as hp } from '../../../pixel';
import { COLOR } from '../../utils/color';

const CustomToast = ({ visible, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible != '') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        hideToast();
      }, 2000);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible != '' ? false : true}
      onRequestClose={() => {}}>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  toastContainer: {
    backgroundColor: COLOR.primaryBlue,
    borderRadius: hp(1),
    paddingVertical: hp(2),
    paddingHorizontal: hp(3),
    marginBottom: hp(5),
  },
  toastText: {
    color: COLOR.white,
    fontSize: hp(2),
    fontFamily: 'Your-Font-Family',
  },
});

export default CustomToast;
