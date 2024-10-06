/* eslint-disable prettier/prettier */
//  ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, TextInput, Dimensions} from 'react-native';

// ** Dimensions Imports
import {horizontalScale} from '../../themes/Metrics';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';

export default function TextField({value, ...otherProps}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <TextInput
      style={[styles.input, {borderColor: isActive ? 'white' : '#868686'}]}
      {...otherProps}
      value={value}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 16,
    // lineHeight: 26,
    color: COLORS.TEXT,
    padding: 0,
    fontFamily: FONTS.REGULAR,
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    alignSelf: 'center',
  },
});
