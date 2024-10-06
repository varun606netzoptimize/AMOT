/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

// ** Component Imports
import Header from '../../components/musicPlayer/info';
import {
  addTracks,
  setupPlayer,
} from '../../components/musicPlayer/trackPlayerServices';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import {AuthContext} from '../../context/AuthContext';

// ** Assets
const musicIcon = require('../../../assets/image/amot-icon.png');

const window = Dimensions.get('window');

export default function MusicPlayerModal({
  playlist,
  selectedTrack,
  isVisible,
  close,
  activePosition = null,
  playlistId = null,
  coverArt = null,
}: any) {
  const {isConnected, setCurrentPlaylist, currentPlaylistDetails} =
    useContext(AuthContext);

  const [isPlayerReady, setIsPlayerReady] = useState(
    activePosition == 0 || activePosition == null ? false : true,
  );

  useEffect(() => {
    if (!isConnected && currentPlaylistDetails.name !== 'Downloaded Audio') {
      close();
    }
  }, [isConnected]);

  useEffect(() => {
    if (activePosition == 0 || activePosition == null) {
      setup();
    }
  }, []);

  async function setup() {
    let isSetup = await setupPlayer();

    if (isSetup) {
      const startIndex =
        currentPlaylistDetails.startIndex - 500 < 0
          ? 0
          : currentPlaylistDetails.startIndex - 500;
      const endIndex =
        currentPlaylistDetails.startIndex + 500 >= playlist.length
          ? playlist.length
          : currentPlaylistDetails.startIndex + 500 + 1;

      const tracks = playlist
        .slice(
          isNaN(startIndex) ? 0 : startIndex,
          isNaN(endIndex) ? playlist.length : endIndex,
        )
        ?.map((item: any, index: number) => ({
          id: String(index),
          url: item.url,
          title: item.name.trim().split(/ +/).join(' '),
          duration: 2400,
          artwork: item.cover ? item.cover : coverArt ? coverArt : musicIcon,
          playlistName: item?.playlistName
            ? item?.playlistName
            : currentPlaylistDetails.name,
        }));

      await addTracks(tracks);
      setCurrentPlaylist(playlist);

      if (activePosition && TrackPlayer) {
        TrackPlayer.seekTo(activePosition);
      } else {
        const selectedTrackIndex = playlist.findIndex(
          (item: any) => item.url === selectedTrack.url,
        );
        if (selectedTrackIndex !== -1) {
          await TrackPlayer.skip(selectedTrackIndex);
          await TrackPlayer.play();
        }
      }
    }

    setIsPlayerReady(isSetup);
  }

  if (!isPlayerReady) {
    return null;
  }

  const startAnimation = (translateX: any, direction: 'next' | 'previous') => {
    const initialValue = direction === 'next' ? 500 : -500;
    const finalValue = 0;

    translateX.setValue(initialValue);
    Animated.timing(translateX, {
      toValue: finalValue,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={() => close()}>
      <SafeAreaView style={styles.main_container}>
        {isPlayerReady ? (
          <Header
            onClose={() => close()}
            playlistId={playlistId}
            selectedTrack={selectedTrack}
            StartAnimationFN={startAnimation}
            activePosition={activePosition}
          />
        ) : (
          <View>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.BASE,
  },
  sub_container: {
    display: 'flex',
    marginBottom: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: 'stretch',
  },
  downloadButton: {
    backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  playlist_title: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: 20,
    textAlign: 'center',
    width: 266,
    lineHeight: 24,
  },
  download_container: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-start',
  },
  logout_container: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'flex-start',
  },
  minimizeTitle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
});
