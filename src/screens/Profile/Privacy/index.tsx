/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

// ** Constant Imports
import {COLORS, FONTS, ENDPOINT} from '../../../constants';
// ** Third Party Imports
import Icon from 'react-native-vector-icons/Ionicons';
import HTMLView from 'react-native-htmlview';
import axios from 'axios';
import {AuthContext} from '../../../context/AuthContext';
import NoInternet from '../../../components/shared/noInternet.tsx';

const baseURL = process.env.BASE_URL;

import TrackPlayer from 'react-native-track-player';

const Privacy = ({navigation}: any) => {
  const {token, isConnected, LogOutStep1, isPlayerActive, setLastActiveTrack} = useContext(AuthContext);
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPrivacyPolicy = () => {
    const url = `${baseURL}${ENDPOINT.PAGE_CONTENT}/privacypolicy`;
    setIsLoading(true);
    axios
      .get(url, {
        headers: {
          authorization: 'Bearer ' + token,
        },
      })
      .then(response => {
        const privacyPolicyHTML = response.data;
        setSource(privacyPolicyHTML);
        setIsLoading(false);
      })
      .catch(err => {
        console.log('failed to get privacy policy', err.response.data);
        setIsLoading(false);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
          }
        }
      });
  };

  useEffect(() => {
    getPrivacyPolicy();
  }, [isConnected]);

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backBtnStyle}>
            <Icon name="arrow-back" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.header}>Privacy Policy</Text>
        </View>

        {isLoading && (
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginTop: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={32} color={COLORS.PRIMARY} />
          </View>
        )}

        {isConnected ? (
          <ScrollView style={{marginTop: 24}} showsVerticalScrollIndicator={false}>
            <View style={{marginBottom: 60}} />
            {source && <HTMLView value={source} stylesheet={styles} />}

            <View style={{margin: 82}} />
          </ScrollView>
        ) : (
          <NoInternet />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.BASE,
    padding: 15,
    paddingBottom: 0,
  },
  header: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: 22,
    alignSelf: 'center',
  },
  text: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 18,
    lineHeight: 25,
  },
  headerBox: {
    alignItems: 'center',
    position: 'relative',
  },
  backBtnStyle: {
    position: 'absolute',
    left: 0,
    top: 2,
  },
  textHeader: {
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    fontSize: 15,
    lineHeight: 25,
    marginTop: 8,
    marginBottom: 8,
  },
  textDescription: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 15,
    lineHeight: 25,
  },
  p: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    marginTop: -60,
    lineHeight: 22,
  },
  ul:{
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    lineHeight: 28,
    marginTop: -50
  },
  li:{
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    lineHeight: 28,
  }
});
