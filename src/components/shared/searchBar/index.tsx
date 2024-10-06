// ** React Imports
import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

// ** Component Imports
import {COLORS, FONTS, SCREENS} from '../../../constants';
import {useNavigation} from '@react-navigation/native';

// ** Assets
const searchImage = require('../../../../assets/image/searchIcon.png');

interface SearchProps {
  padding?: number;
}

const SearchBar = ({padding}: SearchProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(SCREENS.SEARCH)}>
      <View style={[styles.search_container, {padding: padding}]}>
        <Image style={styles.search_image} source={searchImage} />
        <Text style={styles.search_text}>Search</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  search_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'flex-end',
  },
  search_text: {
    fontSize: 20,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
  },
  search_image: {
    width: 20,
    height: 20,
  },
});
