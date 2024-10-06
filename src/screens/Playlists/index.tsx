/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

// ** Constant Imports
import {COLORS, ENDPOINT, FONTS, SCREENS} from '../../constants';

// ** Component Imports
import {Header, SearchBar} from '../../components/shared';
import {AuthContext} from '../../context/AuthContext';
import PurchaseMembership from '../../components/modal/PurchaseMembership';

const amotIcon = require('../../../assets/image/amot-icon.png');

import TrackPlayer from 'react-native-track-player';

import axios from 'axios';
const baseURL = process.env.BASE_URL;

const Playlist = React.memo(
  ({
    id,
    title,
    audioLength,
    url,
    navigation,
    categoryName,
    isPaid,
    setShowPopUp,
  }: any) => {
    const {subStatus} = useContext(AuthContext);

    return (
      <TouchableOpacity
        onPress={() => {
          if (subStatus == 'free' && isPaid.toLowerCase() == 'paid') {
            setShowPopUp(true);
          } else {
            navigation.navigate(SCREENS.AUDIOS, {
              playListId: id,
              name: title,
              categoryName: categoryName,
              url,
            });
          }
        }}
        activeOpacity={0.5}
        disabled={!subStatus}>
        <View style={styles.playlist_main_container}>
          <View style={styles.playlist_sub_container}>
            <Image
              style={styles.playlist_image}
              source={url ? {uri: url} : amotIcon}
            />
          </View>
          <View style={styles.flexShrink}>
            <Text style={styles.playlist_title}>
              {title.length > 52 ? title.slice(0, 52) + '...' : title}
            </Text>
            <Text style={styles.audio_file_text}>
              {audioLength} audio files
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const Playlists = ({route, navigation}) => {
  const {token, LogOutStep1, isPlayerActive, setLastActiveTrack} = useContext(AuthContext);

  const {itemId, name, url} = route.params;
  const [playlistsData, setPlaylistsData] = useState([]);

  const [showPopUp, setShowPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false)

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(page + 1);
    GetPlaylist(itemId, page);
  }, []);

  function GetPlaylist(id, page) {
    const url = `${baseURL}${
      ENDPOINT.CATEGORIES
    }/${id}?page=${page}&time=${new Date().getTime()}`;
    setPageLoading(true);
    
    axios
      .get(url, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setHasNextPage(res.data.has_next_page);
        setPlaylistsData(prevData => [...prevData, ...res.data.products]);
      })
      .catch(err => {
        console.log('failed to fetch playlist');
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
        setPageLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main_container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BASE} />
        <View style={styles.utility_container}>
          <Header bgColor={COLORS.BASE} color={COLORS.TEXT} />
          <SearchBar padding={15} />
        </View>
        <View style={styles.sub_container}>
          <View style={styles.cat_container}>
            <Image
              style={styles.cat_image}
              source={
                url
                  ? {
                      uri: url,
                    }
                  : require('../../../assets/image/amotaudio.png')
              }
            />
          </View>

          <Text style={styles.playlist_name}>{name}</Text>

          <View style={styles.cat_sub_container}>
            {isLoading ? (
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{marginBottom: 160}}>
                  <ActivityIndicator size={58} color={COLORS.SECONDARY} />
                </View>
              </View>
            ) : playlistsData?.length == 0 ? (
              <View
                style={{
                  flex: 2,
                  justifyContent: 'center',
                }}>
                <Text style={styles.noTracksText}>No Tracks Found</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={playlistsData}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item}) => (
                    <Playlist
                      id={item.id}
                      title={item.post_title}
                      url={item.thumbnail}
                      audioLength={item.audios.length}
                      navigation={navigation}
                      categoryName={name}
                      isPaid={item.membership_type.toLowerCase()}
                      setShowPopUp={setShowPopUp}
                    />
                  )}
                  keyExtractor={(item: any) => item.id.toString()}
                  contentContainerStyle={{gap: 20}}
                  onEndReachedThreshold={0.1}
                  onEndReached={() => {
                    if(hasNextPage){
                      setPage(page + 1);
                      GetPlaylist(itemId, page);
                    }
                  }}
                  ListFooterComponent={
                    <>
                      {hasNextPage && (
                        <ActivityIndicator color={COLORS.PRIMARY} />
                      )}

                      <View style={{height: 80}} />
                    </>
                  }
                />
              </>
            )}
          </View>
        </View>
      </View>

      <PurchaseMembership
        hidePop={() => setShowPopUp(false)}
        showPopUp={showPopUp}
      />
    </SafeAreaView>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  flexShrink: {
    flexShrink: 1,
  },
  main_container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  sub_container: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: '4%',
    paddingRight: '4%',
  },
  playlist_name: {
    color: COLORS.SECONDARY,
    fontSize: 22,
    fontFamily: FONTS.BOLD,
    marginBottom: '8%',
    marginTop: '4%',
  },
  playlist_main_container: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  playlist_sub_container: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlist_image: {
    width: 50,
    height: 50,
  },
  playlist_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
    fontSize: 16,
  },
  audio_file_text: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 12,
  },
  utility_container: {
    backgroundColor: COLORS.BASE,
    justifyContent: 'space-between',
  },
  cat_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cat_image: {
    width: 145,
    height: 145,
    // borderRadius: 10,
  },
  cat_sub_container: {
    flex: 1,
    width: '100%',
  },

  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#CADB29',
    backgroundColor: 'black',
    width: '90%',
    borderRadius: 10,
  },
  modalText1: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 20,
    width: '80%',
    lineHeight: 28,
  },
  modalText2: {
    color: '#C0C0C0',
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    lineHeight: 25,
    marginTop: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    marginBottom: 6,
  },
  crossBtn: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 56,
    alignItems: 'center',
  },
  noTracksText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: '30%',
  },
  cancelModalText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    marginTop: 10,
  },
});
