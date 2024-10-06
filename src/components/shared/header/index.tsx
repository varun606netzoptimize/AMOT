/* eslint-disable prettier/prettier */
// ** React Imports
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

// ** Third Party Imports
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({bgColor, color}) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.main_container,
        {
          backgroundColor: bgColor,
        },
      ]}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
        <Icon name="arrow-back" size={25} color={color} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  main_container: {
    padding: 15,
    position: 'absolute',
    zIndex: 111,
    left: 0,
    top: 0,
  },
});
