/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

// ** Constant Imports
import {COLORS, FONTS, SCREENS, ENDPOINT} from '../../constants';

// ** Component Imports
import {ActionMenu} from '../../components/shared';
import {AuthContext} from '../../context/AuthContext';
import {favPlaylist} from '../../redux/slices/favPlaylist';
import {favTracks} from '../../redux/slices/favTracks';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';
import {useActiveTrack, useProgress} from 'react-native-track-player';

const audioIcon = require('../../../assets/image/audioImage.png');

import MusicPlayerModal from '../MusicPlayerModal';
import NoInternet from '../../components/shared/noInternet.tsx';

const FavPlaylist = ({
  allTracks,
  trackData,
  isRemoving,
  setIsRemoving,
}: any) => {
  const {isPlayerActive, setupMusicPlayer, downloaded, setCurrentCoverArt} =
    useContext(AuthContext);

  const [showPlayer, setShowPlayer] = useState(false);
  let trackUrl = trackData.track.url;
  let trackName = trackData.track.name;

  let playlist = allTracks.map((item: any) => ({
    author: item.track.author,
    name: item.track.name,
    url: item.track.url,
    playlistName: item.playlist_name,
    cover: item.thumbnail,
  }));

  let selectedTrack = {url: trackUrl, title: trackName};

  let playlistId = trackData.playlist_id;

  selectedTrack = {url: trackUrl, title: trackName};

  const rearrangeArray = (arr: any, clickedElementUrl: any) => {
    const index = arr.findIndex((item: any) => item.url === clickedElementUrl);
    if (index === -1) return arr;

    const firstPart = arr.slice(index);
    const secondPart = arr.slice(0, index);

    return firstPart.concat(secondPart);
  };

  const [selectedPlaylist, setSelectedPlaylist] = useState(playlist);

  const removeExtraSpace = (text: any) => text.trim().split(/ +/).join(' ');

  return (
    <View style={styles.single_audio_container}>
      <TouchableOpacity
        onPress={() => {
          const newPlaylist = rearrangeArray(playlist, selectedTrack.url);

          if (isPlayerActive) {
            setupMusicPlayer(newPlaylist, selectedTrack);
          } else {
            setSelectedPlaylist(newPlaylist);
            setCurrentCoverArt(trackData.thumbnail);
            setShowPlayer(true);
          }
        }}
        activeOpacity={0.5}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          width: '90%',
        }}>
        <Image style={styles.audio_image} source={audioIcon} />
        <Text style={styles.audio_title}>
          {removeExtraSpace(trackData.track.name).length > 50
            ? removeExtraSpace(trackData.track.name).slice(0, 50) + '...'
            : removeExtraSpace(trackData.track.name)}
        </Text>
      </TouchableOpacity>
      <ActionMenu
        trackData={trackData}
        isRemoving={isRemoving}
        setIsRemoving={setIsRemoving}
      />
      {showPlayer && (
        <MusicPlayerModal
          playlist={selectedPlaylist}
          selectedTrack={selectedTrack}
          isVisible={showPlayer}
          close={() => setShowPlayer(false)}
          playlistId={playlistId}
        />
      )}
    </View>
  );
};

const Favorite = ({navigation}: any) => {
  const {userInfo, myFavTracks, getFavTracks, isConnected, isPlayerActive} =
    useContext(AuthContext);

  const dispatch = useAppDispatch<AppDispatch>();
  // loader state
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setIsRefreshing(true);
    getMyFavTracks();
  };

  const getMyFavTracks = async () => {
    getFavTracks(userInfo?.user_id);
    setIsRemoving(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFavTracks(userInfo?.user_id);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <Text style={styles.heading_first_character}>
          My<Text style={styles.heading_second_character}> AMOT</Text>
        </Text>
        {isConnected ? (
          <>
            {myFavTracks?.length == 0 && (
              <View style={styles.noDownloadBox}>
                <Text style={styles.noDownloads}>
                  No Audio Added to My AMOT
                </Text>
              </View>
            )}

            {myFavTracks == undefined && (
              <View style={styles.noDownloadBox}>
                <Text style={styles.noDownloads}>Something went wrong</Text>
              </View>
            )}

            <View style={styles.sub_container}>
              <FlatList
                data={myFavTracks}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <FavPlaylist
                    allTracks={myFavTracks}
                    trackData={item}
                    isRemoving={isRemoving}
                    setIsRemoving={setIsRemoving}
                  />
                )}
                keyExtractor={item => item?.post_id?.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={refreshData}
                    colors={[COLORS.SECONDARY]}
                    progressBackgroundColor={COLORS.BASE}
                  />
                }
              />

              {isPlayerActive && <View style={{height: 70}} />}
            </View>
          </>
        ) : (
          <NoInternet />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Favorite;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.BASE,
    padding: 15,
    // paddingBottom: 12,
  },
  sub_container: {
    marginTop: 30,
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  heading_first_character: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    fontFamily: FONTS.REGULAR,
  },
  heading_second_character: {
    color: COLORS.PRIMARY,
    fontFamily: FONTS.BOLD,
  },
  single_audio_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  single_audio_sub_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    width: '90%',
  },
  audio_image: {
    width: 35,
    borderRadius: 5,
    height: 35,
  },
  audio_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
  },
  noDownloads: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    textAlign: 'center',
  },
  noDownloadBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 15,
  },
});
