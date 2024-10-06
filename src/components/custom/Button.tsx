//  ** React Imports
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

// ** Dimensions Imports
import {horizontalScale, moderateScale} from '../../themes/Metrics';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';

export default function Button({name, ...otherProps}) {
  return (
    <TouchableOpacity
      disabled={otherProps.loading}
      activeOpacity={0.5}
      style={styles.button}
      {...otherProps}>
      {otherProps.loading ? (
        <ActivityIndicator size={30} color={COLORS.BASE} />
      ) : (
        <Text style={styles.ButtonText}>{name}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.PRIMARY,
    height: 50,
    width: horizontalScale(220),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  ButtonText: {
    fontSize: moderateScale(23),
    color: COLORS.BASE,
    fontFamily: FONTS.BOLD
  },
});
