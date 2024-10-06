/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
// ** React Imports
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import {useContext, useEffect, useState} from 'react';

// ** Third Party Imports
import {useActiveTrack, useProgress} from 'react-native-track-player';

// ** Component Imports
import {useLastActiveTrack} from './../hooks';
import {PlayPauseButton} from './playerControls';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';
import React from 'react';
import MusicPlayerModal from '../../screens/MusicPlayerModal';
import {AuthContext} from '../../context/AuthContext';

export const FloatingPlayer = ({style}: ViewProps) => {
  const {
    setIsPlayerActive,
    currentPlaylist,
    currentPlaylistDetails,
    isConnected,
  } = useContext(AuthContext);

  const [showPlayer, setShowPlayer] = useState(false);

  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();
  const {position} = useProgress(200);

  const displayedTrack = activeTrack ?? lastActiveTrack;

  useEffect(() => {
    setIsPlayerActive(displayedTrack ? true : false);
  }, [displayedTrack]);


  let url = displayedTrack?.url;
  let title = displayedTrack?.title;

  let playlist = currentPlaylist;
  let selectedTrack = {url, title};

  if (!displayedTrack) return null;

  const removeExtraSpace = (text: any) => text.trim().split(/ +/).join(' ');

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowPlayer(true);
        }}
        activeOpacity={0.5}
        style={[styles.container, style]}
        disabled={
          !isConnected && currentPlaylistDetails.name !== 'Downloaded Audio'
        }>
        <>
          <Image
            source={
              displayedTrack.artwork
                ? {
                    uri: displayedTrack.artwork,
                  }
                : require('../../../assets/image/headphone.png')
            }
            style={styles.trackArtworkImage}
          />

          <View style={styles.trackTitleContainer}>
            <Text style={styles.trackTitle}>
              {removeExtraSpace(displayedTrack?.title)?.length > 40
                ? removeExtraSpace(displayedTrack?.title).slice(0, 40) + '...'
                : removeExtraSpace(displayedTrack?.title)}
            </Text>
          </View>

          <View style={styles.trackControlsContainer}>
            <PlayPauseButton iconSize={32} />
          </View>
        </>
      </TouchableOpacity>
      {showPlayer && (
        <MusicPlayerModal
          playlist={playlist}
          selectedTrack={selectedTrack}
          isVisible={showPlayer}
          close={() => setShowPlayer(false)}
          activePosition={position}
          coverArt={displayedTrack.artwork}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    padding: 8,
    borderRadius: 12,
    paddingVertical: 10,
  },
  trackArtworkImage: {
    width: 40,
    height: 40,
  },
  trackTitleContainer: {
    flex: 1,
    overflow: 'hidden',
    marginLeft: 10,
  },
  trackTitle: {
    fontSize: 15,
    paddingLeft: 10,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
  },
  trackControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginRight: 16,
    paddingLeft: 16,
  },
});
