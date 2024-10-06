/* eslint-disable prettier/prettier */
// ** React Imports
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

const noWifi = require('../../../../assets/image/noWifi.png');

export default function NoInternet() {
  return (
    <View style={styles.container}>
      <Image source={noWifi} style={styles.image} />
      <Text style={styles.text1}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
  },
  image: {
    width: 240,
    height: 240,
    marginTop: -100,
  },
});
