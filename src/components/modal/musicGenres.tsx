// ** React Imports
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

//  ** Component Imports
import {SCREENS} from '../../constants';
import RecommendationModal from './recommendation';

const genres = [
  {name: 'Haryanvi', color: '#ff7300'},
  {name: 'Hindi', color: '#b9bb3d'},
  {name: 'English', color: '#642dca'},
  {name: 'Punjabi', color: '#2b53d8'},
  {name: 'Tamil', color: '#2bd2d8'},
  {name: 'Telugu', color: '#a116c4'},
  {name: 'Gujarati', color: '#9bd82b'},
  {name: 'Marathi', color: '#28b98e'},
];

const MusicGenres = () => {
  const navigation: any = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.isFocused()) {
          setModalVisible(true);
          return true;
        }
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.main_container}>
      <Text style={styles.main_heading}>What music do you like?</Text>
      <View style={styles.sub_container}>
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[styles.card_container, {backgroundColor: genre.color}]}
            onPress={() => navigation.navigate(SCREENS.HOME)}>
            <Text style={styles.card_title}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <RecommendationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        buttonText="Got it"
        headingText="Choose at least one language to help us give better recommendations"
      />
    </View>
  );
};

export default MusicGenres;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#131212',
    padding: 20,
  },
  main_heading: {
    color: 'white',
    fontSize: 35,
    fontWeight: '700',
    marginBottom: 20,
  },
  sub_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card_container: {
    width: '45%',
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  card_title: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    padding: 10,
  },
});
