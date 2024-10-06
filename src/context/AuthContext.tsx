/* eslint-disable prettier/prettier */
// ** React Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {ReactNode, createContext, useEffect, useState} from 'react';

import {Dimensions, Alert} from 'react-native';

// ** Type Imports
import {UserInfo} from '../@types';

interface AuthContextType {
  token: string | null;
  userInfo: UserInfo | null;
  isLoggedIn: () => Promise<void>;
  SetNotificationFN: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

import {favTracks} from '../redux/slices/favTracks';
import {AppDispatch, useAppDispatch} from '../redux/store';
import {ENDPOINT} from '../constants';
import {
  addTracks,
  setupPlayer,
} from '../components/musicPlayer/trackPlayerServices';
import TrackPlayer from 'react-native-track-player';
const musicIcon = require('../../assets/image/amot-icon.png');

import axios from 'axios';

const rest_api_key = process.env.REST_API_KEY;
const baseURL = process.env.BASE_URL;
const subId = process.env.subscription_id;

import {getUniqueId} from 'react-native-device-info';

import notifee from '@notifee/react-native';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';

import NetInfo from '@react-native-community/netinfo';

export const AuthProvider = ({children}: AuthProviderProps) => {
  const dispatch = useAppDispatch<AppDispatch>();

  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [myFavTracks, setMyFavTracks] = useState<any[]>([]);
  const [subStatus, setSubStatus] = useState(null);
  const [downloaded, setDownloaded] = useState(null);
  const [currentDownloading, setCurrentlyDownloading] = useState(null);
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [playerDownloadProgress, setPlayerDownloadProgress] = useState(0);
  const [isPlayerDownloading, setIsPlayerDownloading] = useState(false);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  // player control
  const [isPaused, setIsPaused] = useState(false);

  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const [currentPlaylistDetails, SetCurrentPlaylistDetails] = useState({
    id: '',
    name: '',
  });
  const [currentPlaylistID, setCurrentPlaylistID] = useState(null);
  const [currentCoverArt, setCurrentCoverArt] = useState(null);

  const [lastActiveTrack, setLastActiveTrack] = useState();

  // Check whether user is logged in or not
  const isLoggedIn = async () => {
    const getToken: any = await AsyncStorage.getItem('token');
    const getUser: any = await AsyncStorage.getItem('user');

    if (getToken && getUser) {
      setToken(getToken);

      setUserInfo(JSON.parse(getUser));

      getFavTracks(JSON.parse(getUser).user_id);
      getSubscriptionStatus(getToken);
      fetchAudioFiles(JSON.parse(getUser).user_id);
      setIsTokenLoading(false);
    } else {
      setIsTokenLoading(false);
    }
  };

  async function getSubscriptionStatus(token) {
    const url = `${baseURL}${
      ENDPOINT.SUBSCRIPTION_STATUS
    }?time=${new Date().getTime()}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(url, config);

      setSubStatus(response.data.status);
    } catch (error) {
      console.log('failed');
    }
  }

  const [logoutSpinner, setLogoutSpinner] = useState(false);

  function LogOutStep1() {
    setLogoutSpinner(true);
    getUniqueId().then(uuid => {
      logOutStep2(uuid);
    });

  }

  const logOutStep2 = async (uuid: any) => {
    const url = `${baseURL}/fcm/pn/unsubscribe`;

    const data = {
      rest_api_key: rest_api_key,
      device_uuid: uuid,
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log('success', res.data);
        logOutFinal();
      })
      .catch(err => {
        setLogoutSpinner(false);
        logOutFinal();
        console.log('failed to unsubscribe:', err?.response?.data);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
          }
        }
      });
  };

  // Log Out
  const logOutFinal = async () => {
    setLogoutSpinner(false);
    await AsyncStorage.removeItem('token').then(() => {
      setToken(null);
      setUserInfo(null);
      setMyFavTracks([]);
      setSubStatus(null);
      setDownloaded(null);
      setCurrentlyDownloading(null);
      setIsDownloading({
        isDownloading: false,
        track: null,
      });
      setIsPlayerActive(false);
      setPlayerDownloadProgress(0);
      setIsPlayerDownloading(false);
      setLogoutSpinner(false);
    });
  };

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    isLoggedIn();
  }, [isConnected]);

  // Get Favourite Tracks
  const getFavTracks = async (user_id: any) => {
    const tracksResponse = await dispatch(favTracks(user_id));
    setMyFavTracks(tracksResponse.payload);
  };

  let deviceHeight = Dimensions.get('window').height;

  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  async function setupMusicPlayer(playlist, selectedTrack, coverArt) {
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
        ?.slice(
          isNaN(startIndex) ? 0 : startIndex,
          isNaN(endIndex) ? playlist.length : endIndex,
        )
        .map((item: any, index: number) => ({
          id: index.toString(),
          url: item.url,
          title: item.name.trim().split(/ +/).join(' '),
          duration: 2400,
          artwork: item.cover ? item.cover : coverArt ? coverArt : musicIcon,
          playlistName: item?.playlistName,
        }));

      setCurrentPlaylist(playlist);

      await addTracks(tracks);
      const selectedTrackIndex = playlist.findIndex(
        (item: any) => item.url === selectedTrack.url,
      );
      if (selectedTrackIndex !== -1) {
        await TrackPlayer.skip(selectedTrackIndex);
        await TrackPlayer.play();
      }
    }
  }

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState({
    isDownloading: false,
    track: null,
  });

  const StartDownloadFN = async (url: any, fileName: any) => {
    console.log('url:', url, 'fileName:', fileName);

    const dirs = RNFS.DocumentDirectoryPath;
    const filePath = `${dirs}/userID=${userInfo?.user_id}/${fileName}.mp3`;

    setIsDownloading({isDownloading: true, track: fileName});
    setCurrentlyDownloading(fileName);

    notifee.displayNotification({
      title: 'Download in Progress',
      body: `Downloading ${fileName.trim().split(/ +/).join(' ')}`,
      android: {
        channelId: 'download-progress',
      },
    });

    try {
      const res = await RNFetchBlob.config({path: filePath})
        .fetch('GET', url)
        .progress({interval: 250}, (received, total) => {
          setDownloadProgress(received / total);
        });
      if (res.respInfo.status === 200) {
        console.log('File downloaded to:', filePath);
        setIsDownloading({isDownloading: false, track: null});
        setCurrentlyDownloading(null);
        fetchAudioFiles(userInfo?.user_id);

        setTimeout(() => {
          setDownloadProgress(0);
        }, 2000);

        notifee.displayNotification({
          title: 'Download complete',
          body: `Downloaded track: ${fileName.trim().split(/ +/).join(' ')}`,
          android: {
            channelId: 'download-progress',
          },
        });

        return filePath;
      } else {
        setIsDownloading({isDownloading: false, track: null});
        setDownloadProgress(0);
        console.log('Download failed');
        setCurrentlyDownloading(null);

        notifee.displayNotification({
          title: 'Download failed',
          body: `Failed to Download track: ${fileName
            .trim()
            .split(/ +/)
            .join(' ')}`,
          android: {
            channelId: 'download-progress',
          },
        });

        return null;
      }
    } catch (error) {
      setIsDownloading({isDownloading: false, track: null});
      setCurrentlyDownloading(null);
      setDownloadProgress(0);
      console.error('Error downloading file:', error);

      deleteTrack(filePath);

      notifee.displayNotification({
        title: 'Download failed',
        body: `Failed to Download track: ${fileName
          .trim()
          .split(/ +/)
          .join(' ')}`,
        android: {
          channelId: 'download-progress',
        },
      });

      return null;
    }
  };

  const deleteTrack = async (track: string) => {
    try {
      await RNFS.unlink(track);
      fetchAudioFiles(userInfo?.user_id);
      console.log(track, 'deleted');
    } catch (error) {
      console.log('Error deleting track:', error, track);
    }
  };

  const fetchAudioFiles = async userID => {
    try {
      const dirs = `${RNFS.DocumentDirectoryPath}/userID=${userID}`;
      const files = await RNFS.readdir(dirs);

      const audioFiles = files
        .filter(file => file.endsWith('.mp3'))
        .map(file => `${dirs}/${file}`);
      setDownloaded(audioFiles);
    } catch (error) {}
  };

  const unsubScribeNotifications = (uuid: any) => {
    const url = `${baseURL}/fcm/pn/unsubscribe`;

    const data = {
      rest_api_key: rest_api_key,
      device_uuid: uuid,
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {})
      .catch((err: any) => {
        console.log('failed to unsubscribe:', err.response.data);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
      });
  };

  const subScribeNotifications = (uuid: any, deviceToken: any) => {
    const url = `${baseURL}/fcm/pn/subscribe`;

    const data = {
      device_uuid: uuid,
      device_token: deviceToken,
      rest_api_key: rest_api_key,
      subscription: subId,
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {})
      .catch((err: any) => {
        console.log('result:', err);
        console.log('failed to subscribe:', err.response.data);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
      });
  };

  async function SetNotificationFN(status: any) {
    const url = `${baseURL}${ENDPOINT.SET_NOTIFICATION_STATUS}`;

    const data = {
      id: userInfo?.user_id,
      receive_notifications: status,
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setIsNotificationEnabled(status == 'yes' ? true : false);
      })
      .catch(err => {
        console.log('failed to set notification:');
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
      });
  }

  return (
    <AuthContext.Provider
      value={{
        SetNotificationFN,
        token,
        setToken,
        isLoggedIn,
        userInfo,
        setUserInfo,
        myFavTracks,
        getFavTracks,
        setMyFavTracks,
        deviceHeight,
        subStatus,
        downloaded,
        setDownloaded,
        fetchAudioFiles,
        setupMusicPlayer,
        isPlayerActive,
        setIsPlayerActive,
        currentDownloading,
        setCurrentlyDownloading,
        playerDownloadProgress,
        setPlayerDownloadProgress,
        isPlayerDownloading,
        setIsPlayerDownloading,
        StartDownloadFN,
        isDownloading,
        setIsDownloading,
        downloadProgress,
        setDownloadProgress,
        currentPlaylist,
        isConnected,
        isTokenLoading,
        isPaused,
        setIsPaused,
        LogOutStep1,
        currentPlaylistID,
        setCurrentPlaylistID,
        currentCoverArt,
        setCurrentCoverArt,
        currentPlaylistDetails,
        SetCurrentPlaylistDetails,
        isNotificationEnabled,
        setIsNotificationEnabled,
        subScribeNotifications,
        unsubScribeNotifications,
        lastActiveTrack,
        setLastActiveTrack,
        logoutSpinner,
        setCurrentPlaylist,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userInfo: null,
  isLoggedIn: async () => {},
  SetNotificationFN: async () => {},
});
