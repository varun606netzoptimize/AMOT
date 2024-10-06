/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

// ** Dimensions Imports
import {horizontalScale} from '../../themes/Metrics';

// ** Constant Imports
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS, FONTS} from '../../constants';
// ** Assets

// ** Types
type PasswordTextInputType = {
  value: string;
  togglePasswordVisibility: () => void;
};

export default function PasswordTextInput({
  value,
  ...allProps
}: PasswordTextInputType) {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isActive, setIsActive] = useState(false);

  return (
    <View
      style={[styles.container, {borderColor: isActive ? 'white' : '#868686'}]}>
      <TextInput
        style={styles.input}
        {...allProps}
        value={value}
        secureTextEntry={showPassword}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
      <TouchableOpacity
        style={styles.iconBox}
        onPress={togglePasswordVisibility}>
        {showPassword ? (
          <Icon name="eye-slash" size={23} color={'#919191'} />
        ) : (
          <Icon name="eye" size={23} color={COLORS.SECONDARY} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: COLORS.BASE,
    justifyContent: 'space-between',
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
  },
  input: {
    width: '90%',
    height: 48,
    alignSelf: 'center',
    fontSize: 16,
    color: COLORS.TEXT,
    padding: 0,
    fontFamily: FONTS.REGULAR,
  },
  iconBox: {
    marginLeft: 10,
  },
});
