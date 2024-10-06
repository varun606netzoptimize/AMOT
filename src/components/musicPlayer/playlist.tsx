/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

// ** Third Party Imports
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';

import {useProgress, useActiveTrack} from 'react-native-track-player';

import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, FONTS, ENDPOINT} from '../../constants';

import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';

import {favTracks} from '../../redux/slices/favTracks';
import {useAppDispatch, AppDispatch} from '../../redux/store';

const baseURL = process.env.BASE_URL;

const Playlist = ({
  playlistId = null,
  selectedTrack = null,
  trackTranslateX,
  StartAnimationFN,
  displayHeart = true,
}: any) => {
  const {
    userInfo,
    token,
    myFavTracks,
    setMyFavTracks,
    // getFavTracks,
    downloaded,
    StartDownloadFN,
    isDownloading,
    downloadProgress,
    isPaused,
    setIsPaused,
    isConnected,
    currentPlaylistID,
    subStatus,
  } = useContext(AuthContext);

  const dispatch = useAppDispatch<AppDispatch>();

  const activeTrack = useActiveTrack();
  const [favAudio, setFavAudio] = useState([]);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const isUrlMatched = myFavTracks?.some(
    (track: any) => track.track.url === activeTrack?.url,
  );

  let isLiked = favAudio?.some(audio => audio?.track?.url === activeTrack?.url);
  let myTrack = myFavTracks?.find(
    item => item?.track?.name === activeTrack?.title,
  );

  async function loadPlaylist() {
    const queue = await TrackPlayer.getQueue();
    if (!isPaused) {
      TrackPlayer.play();
    }
  }

  const playerState = usePlaybackState();

  useEffect(() => {
    loadPlaylist();
  }, []);

  useEffect(() => {
    setFavAudio(myFavTracks);
  }, [myFavTracks]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.state == State.nextTrack) {
      let index = await TrackPlayer.getCurrentTrack();
    }
  });

  const [shuffled, setShuffled] = useState(false);

  // async function handleShuffle() {
  //   let queue = await TrackPlayer.getQueue();
  //   await TrackPlayer.reset();
  //   queue.sort(() => Math.random() - 0.5);
  //   await TrackPlayer.add(queue);
  //   loadPlaylist();
  //   setShuffled(true);
  // }

  const addAudioToFavourite = async () => {
    const url = `${baseURL}${ENDPOINT.ADD_TO_FAVOURTIE}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setIsAddLoading(true);

    const data = {
      user_id: userInfo?.user_id,
      playlist_id: currentPlaylistID
        ? currentPlaylistID
        : playlistId
        ? playlistId
        : myTrack.playlist_id,
      audio_name: activeTrack?.title,
      url: activeTrack?.url,
    };

    try {
      const response = await axios.post(url, data, config);
      console.log('Response:', response.data);
      getFavTracks(userInfo.user_id);
    } catch (error) {
      console.log('Error:', error.response.data, data);
    }
  };

  const removeFavourite = async trackData => {
    const url = `${baseURL}${ENDPOINT.REMOVE_FAVOURITE}`;
    const config = {
      headers: {Authorization: `Bearer ${token}`},
      data: {post_id: trackData.post_id.toString()},
    };

    try {
      const response = await axios.delete(url, config);
      console.log('Response:', response.data);
      getFavTracks(userInfo.user_id);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getFavTracks = async (user_id: any) => {
    const tracksResponse = await dispatch(favTracks(user_id));
    console.log(tracksResponse);

    setMyFavTracks(tracksResponse.payload);

    if (tracksResponse) {
      setIsAddLoading(false);
    }
  };

  const fileNames = downloaded?.map(filePath => {
    const parts = filePath.split('/');
    return parts.pop();
  });

  const isDownloaded =
    fileNames?.includes(activeTrack?.title) ||
    fileNames?.includes(`${activeTrack?.title}.mp3`) ||
    fileNames?.includes(`${activeTrack?.title?.replace(/\s+/g, '')}.mp3`);

  return (
    <View style={styles.playlist}>
      <View style={styles.actionBtnContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 24}}>
          {displayHeart &&
            (playlistId || myTrack || currentPlaylistID) &&
            (isAddLoading ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (!isLiked || !isUrlMatched) {
                    addAudioToFavourite();
                  } else {
                    removeFavourite(
                      favAudio.find(
                        track => track?.track?.url == activeTrack?.url,
                      ),
                    );
                  }
                }}
                disabled={!isConnected}>
                <IconAntDesign
                  color={isLiked || isUrlMatched ? COLORS.PRIMARY : COLORS.TEXT}
                  name={isLiked || isUrlMatched ? 'heart' : 'hearto'}
                  size={30}
                />
              </TouchableOpacity>
            ))}

          {/* <TouchableOpacity
            onPress={() => {
              // handleShuffle();
            }}
            disabled={playerState.state == 'error'}>
            <Ionicons
              color={shuffled ? COLORS.PRIMARY : COLORS.TEXT}
              name="shuffle"
              size={30}
            />
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          style={[
            styles.downloadBtn,
            {
              backgroundColor:
                isDownloading.track?.replace(/\s+/g, '') ===
                  activeTrack?.title?.replace(/\s+/g, '') &&
                isDownloading.isDownloading
                  ? '#6c6c6c'
                  : isDownloaded
                  ? COLORS.PRIMARY
                  : '#6c6c6c',
            },
          ]}
          disabled={isDownloaded || !isConnected || downloaded?.length >= 10}
          onPress={() => {
            if (subStatus == 'free') {
              Alert.alert('Get access to downloads with a paid membership');
            } else {
              if (isDownloading.isDownloading) {
                Alert.alert(`"${isDownloading.track}" download in progress`);
              } else {
                StartDownloadFN(activeTrack?.url, activeTrack?.title);
              }
            }
          }}>
          {isDownloading.track?.replace(/\s+/g, '') ===
            activeTrack?.title?.replace(/\s+/g, '') &&
          isDownloading.isDownloading ? (
            <Text style={styles.downloading}>
              {Math.floor(downloadProgress * 100)}%
            </Text>
          ) : (
            <IconAntDesign
              color={isDownloaded ? 'black' : COLORS.TEXT}
              name="download"
              size={15}
            />
          )}

          <Text
            style={[
              styles.downloadText,
              {
                color:
                  isDownloading.track?.replace(/\s+/g, '') ===
                    activeTrack?.title?.replace(/\s+/g, '') &&
                  isDownloading.isDownloading
                    ? COLORS.PRIMARY
                    : isDownloaded
                    ? 'black'
                    : 'white',
              },
            ]}>
            {isDownloading.track?.replace(/\s+/g, '') ===
              activeTrack?.title?.replace(/\s+/g, '') &&
            isDownloading.isDownloading
              ? 'Downloading'
              : isDownloaded
              ? 'Downloaded'
              : downloaded?.length == 10
              ? 'limit reached'
              : 'Download'}
          </Text>
        </TouchableOpacity>
      </View>
      <Controls
        // onShuffle={handleShuffle}
        setIsPaused={setIsPaused}
        trackTranslateX={trackTranslateX}
        StartAnimationFN={StartAnimationFN}
      />
    </View>
  );
};

function Controls({setIsPaused, trackTranslateX, StartAnimationFN}: any) {
  const {currentPlaylistDetails, isConnected} = useContext(AuthContext);

  const playerState = usePlaybackState();

  async function handlePlayPress() {
    if (playerState.state == State.Playing) {
      await TrackPlayer.pause();
      setIsPaused(true);
    } else {
      await TrackPlayer.play();
      setIsPaused(false);
    }
  }

  useEffect(() => {
    if (playerState.state == 'error') {
      TrackPlayer.pause();
    }

    if (!isConnected && currentPlaylistDetails.name !== 'Downloaded Audio') {
      // TrackPlayer.pause();
    }
  }, [playerState.state, currentPlaylistDetails.name, isConnected]);

  const {position} = useProgress(200);

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        onPress={() => {
          TrackPlayer.skipToPrevious();
          StartAnimationFN(trackTranslateX, 'previous');
        }}>
        <IconAntDesign color={'white'} name="stepbackward" size={28} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => TrackPlayer.seekTo(position - 10)}>
        {/* <IconAntDesign color={'white'} name="doubleleft" size={28} /> */}
        <Icon name="replay-10" size={40} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePlayPress}
        disabled={
          !isConnected && currentPlaylistDetails.name !== 'Downloaded Audio'
        }>
        {playerState.state == 'buffering' ? (
          <ActivityIndicator color={COLORS.PRIMARY} size={64} />
        ) : (
          <IconAntDesign
            color={COLORS.PRIMARY}
            name={
              playerState.state === 'paused' || playerState.state == 'ready'
                ? 'play'
                : 'pause'
            }
            size={64}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => TrackPlayer.seekTo(position + 10)}>
        {/* <IconAntDesign color={'white'} name="doubleright" size={28} /> */}
        <Icon name="forward-10" size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          TrackPlayer.skipToNext();
          StartAnimationFN(trackTranslateX, 'next');
        }}>
        <IconAntDesign color={'white'} name="stepforward" size={28} />
      </TouchableOpacity>
    </View>
  );
}

export default Playlist;

const styles = StyleSheet.create({
  playlist: {
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  playlistItem: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  controlsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    paddingLeft: 10,
    paddingRight: 10,
  },
  actionBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingLeft: 12,
    paddingRight: 12,
  },
  downloadBtn: {
    padding: 16,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  downloadText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
  },
  downloading: {
    fontFamily: FONTS.BOLD,
    fontSize: 12,
    color: COLORS.PRIMARY,
  },
});
