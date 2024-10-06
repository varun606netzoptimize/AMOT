import {StyleSheet, View, Image} from 'react-native';
import React from 'react';
import {COLORS} from '../constants';

const logo2 = require('../../assets/image/logo2.png');

export default function BlankScreen() {
  return (
    <View style={styles.container}>
      <Image source={logo2} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.PRIMARY,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    height: 200,
    width: 200,
  },
});
