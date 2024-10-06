/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useEffect, useState, useContext} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';

import {AuthContext} from '../../context/AuthContext';

// ** Constant Imports
import {COLORS, ENDPOINT, FONTS} from '../../constants';

// ** Component Imports
import {Header, SearchBar} from '../../components/shared';

import axios from 'axios';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import * as Progress from 'react-native-progress';
import MusicPlayerModal from '../MusicPlayerModal';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';

import TrackPlayer from 'react-native-track-player';

const audioIcon = require('../../../assets/image/audioImage.png');
const heartOutline = require('../../../assets/image/heart-outline.png');
const heartLiked = require('../../../assets/image/heart-liked.png');
import NoInternet from '../../components/shared/noInternet.tsx';
import PurchaseMembership from '../../components/modal/PurchaseMembership.tsx';

const baseURL = process.env.BASE_URL;

const OptionModal = ({
  showOptions,
  setShowOptions,
  selectedAudio,
  setSelectedAudio,
  playListId,
  userId,
  token,
}: any) => {
  const {
    myFavTracks,
    downloaded,
    fetchAudioFiles,
    StartDownloadFN,
    isDownloading,
    downloadProgress,
    userInfo,
    getFavTracks,
    subStatus,
  } = useContext<any>(AuthContext);

  const [favAudio, setFavAudio] = useState([]);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const TrackName = selectedAudio?.name;

  useEffect(() => {
    setFavAudio(myFavTracks);
  }, [myFavTracks]);

  const addAudioToFavourite = async (audioData: any) => {
    const url = `${baseURL}${ENDPOINT.ADD_TO_FAVOURTIE}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const data = {
      user_id: userId,
      playlist_id: playListId,
      audio_name: audioData.name,
      url: audioData.url,
    };

    try {
      const response = await axios.post(url, data, config);
      console.log('Response:', response.data);
      setFavAudio(prev => [...prev, audioData]);
      Toast.show({
        type: 'success',
        text1: 'Track Liked',
        text2: 'Track Added to My AMOT',
      });
      getFavTracks(userInfo.user_id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsAddLoading(false);
    }
  };

  const isUrlMatched = myFavTracks?.some(
    track => track.track.url === selectedAudio?.url,
  );

  useEffect(() => {
    fetchAudioFiles(userInfo?.user_id);
  }, []);

  const fileNames = downloaded?.map(filePath => {
    const parts = filePath.split('/');
    const fileName = parts.pop();
    return fileName;
  });

  const cleanedFileNames = fileNames?.map((name: any) =>
    name.replace(/\s+/g, ''),
  );

  const isIncluded = cleanedFileNames?.includes(
    TrackName?.replace(/\s+/g, '') + '.mp3',
  );

  function handleFavAudio(audio: any) {
    if (favAudio?.some(item => item.track.url === audio.url)) {
      // If the track is already in favAudio, return the matching object
      removeFavourite(favAudio.find(item => item.track.url === audio.url));
    } else {
      if (favAudio?.includes(audio)) {
        setFavAudio(prev => prev.filter(item => item !== audio));
      } else {
        addAudioToFavourite(audio);
        setIsAddLoading(true);
      }
    }
  }

  const removeFavourite = async (data: any) => {
    const url = `${baseURL}${ENDPOINT.REMOVE_FAVOURITE}`;
    const config = {
      headers: {Authorization: `Bearer ${token}`},
      data: {post_id: data.post_id.toString()},
    };
    try {
      const response = await axios.delete(url, config);
      console.log('Track removed from my amot:', response.data);
      setFavAudio(prev => prev.filter(item => item.post_id !== data.post_id));
    } catch (error) {
      console.log('Error:', error, userInfo?.user_id);
    }
  };
  return (
    <Modal
      transparent
      animationType="slide"
      visible={showOptions}
      onRequestClose={() => {
        setShowOptions(false);
        setSelectedAudio(null);
      }}>
      <SafeAreaView
        style={styles.modalContainer}
        onTouchStart={() => {
          setShowOptions(false);
          setSelectedAudio(null);
        }}
      />
      <View style={styles.innerModalContainer}>
        <View style={styles.wideMarker} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 16,
          }}>
          <Image style={styles.audio_image} source={audioIcon} />
          <View style={styles.flexShrink}>
            <Text style={styles.audio_title}>
              {TrackName?.trim()?.split(/ +/)?.join(' ')?.length > 52
                ? TrackName?.trim()?.split(/ +/)?.join(' ')?.slice(0, 52) +
                  '...'
                : TrackName?.trim()?.split(/ +/)?.join(' ')}
            </Text>
          </View>
        </View>
        <View style={styles.HR} />
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleFavAudio(selectedAudio)}
          disabled={favAudio?.includes(selectedAudio) || isUrlMatched || isAddLoading}>
          {isAddLoading ? (
            <View style={{marginRight: 16}}>
              <ActivityIndicator size={34} color={COLORS.PRIMARY} />
            </View>
          ) : (
            <Image
              source={
                favAudio?.includes(selectedAudio) || isUrlMatched
                  ? heartLiked
                  : heartOutline
              }
              style={{width: 25.27, height: 23, marginRight: 16}}
            />
          )}
          <Text
            style={[
              styles.optionText,
              {
                color: isAddLoading
                  ? COLORS.PRIMARY
                  : favAudio?.includes(selectedAudio) || isUrlMatched
                  ? COLORS.PRIMARY
                  : 'white',
              },
            ]}>
            {favAudio?.includes(selectedAudio) || isUrlMatched
              ? 'Added to my AMOT'
              : isAddLoading
              ? 'Adding to My AMOT . . . '
              : 'Add to My AMOT'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionContainer}
          disabled={downloaded?.length >= 10 || isIncluded}
          onPress={() => {
            if (subStatus == 'free') {
              Alert.alert('Get access to downloads with a paid membership');
            } else {
              if (isDownloading.isDownloading) {
                Alert.alert(`"${isDownloading.track}" download in progress`);
              } else {
                StartDownloadFN(selectedAudio?.url, TrackName);
              }
            }
          }}>
          {isDownloading.isDownloading &&
          isDownloading?.track.replace(/\s+/g, '') ===
            TrackName?.replace(/\s+/g, '') ? (
            <Progress.Circle
              size={34}
              color={COLORS.PRIMARY}
              thickness={2}
              progress={downloadProgress}
              strokeCap="round"
              showsText={true}
              formatText={() => (
                <Text>{Math.floor(downloadProgress * 100)}%</Text>
              )}
              textStyle={{fontSize: 10}}
              borderWidth={0}
            />
          ) : (
            <IconAntDesign
              color={
                cleanedFileNames?.includes(
                  TrackName?.replace(/\s+/g, '') + '.mp3',
                ) ||
                (isDownloading.isDownloading &&
                  isDownloading?.track.replace(/\s+/g, '') ===
                    TrackName?.replace(/\s+/g, ''))
                  ? COLORS.PRIMARY
                  : downloaded?.length >= 10
                  ? 'grey'
                  : COLORS.TEXT
              }
              name={
                cleanedFileNames?.includes(
                  TrackName?.replace(/\s+/g, '') + '.mp3',
                )
                  ? 'checkcircle'
                  : 'download'
              }
              size={30}
            />
          )}
          <Text
            style={[
              styles.optionText,
              {
                marginLeft: 16,
                color:
                  cleanedFileNames?.includes(
                    TrackName?.replace(/\s+/g, '') + '.mp3',
                  ) ||
                  (isDownloading.isDownloading &&
                    isDownloading?.track.replace(/\s+/g, '') ===
                      TrackName?.replace(/\s+/g, ''))
                    ? COLORS.PRIMARY
                    : downloaded?.length >= 10
                    ? 'grey'
                    : COLORS.TEXT,
              },
            ]}>
            {downloaded?.length >= 10
              ? 'Download limit reached'
              : isDownloading.isDownloading &&
                isDownloading?.track.replace(/\s+/g, '') ===
                  TrackName?.replace(/\s+/g, '')
              ? 'Downloading Track...'
              : cleanedFileNames?.includes(
                  TrackName?.replace(/\s+/g, '') + '.mp3',
                )
              ? 'Download Complete'
              : 'Download for offline listening'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const Audio = React.memo(
  ({
    allData,
    title,
    url,
    playlist,
    playListId,
    setShowOptions,
    setSelectedAudio,
    coverArt,
    playlistName,
  }: any) => {
    const {
      isPlayerActive,
      setupMusicPlayer,
      downloaded,
      setCurrentPlaylistID,
      SetCurrentPlaylistDetails,
      setCurrentPlaylist,
      currentPlaylist,
    } = useContext<any>(AuthContext);
    
    const [showPlayer, setShowPlayer] = useState(false);

    let selectedTrack = {url, title};
    let myPlaylist = playlist;

    const rearrangeArray = (arr, clickedElementUrl) => {
      const index = arr.findIndex(item => item.url === clickedElementUrl);
      if (index === -1) return arr; // If the clicked element is not in the array, return the original array

      const firstPart = arr.slice(index); // Elements from the clicked element to the end
      const secondPart = arr.slice(0, index); // Elements from the start to just before the clicked element

      return firstPart.concat(secondPart); // Concatenate the two parts
    };

    const removeExtraSpace = (text: any) => text.trim().split(/ +/).join(' ');

    return (
      <View activeOpacity={0.5}>
        <View style={styles.single_audio_container}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}
            onPress={() => {
              const newPlaylist = rearrangeArray(myPlaylist, selectedTrack.url);
              setCurrentPlaylist(newPlaylist);

              if (isPlayerActive) {
                SetCurrentPlaylistDetails({
                  id: playListId,
                  name: playlistName,
                  startIndex: myPlaylist.findIndex(
                    item => item.url === selectedTrack.url,
                  ),
                });
                setCurrentPlaylistID(playListId);
                setupMusicPlayer(newPlaylist, selectedTrack, coverArt);
              } else {
                SetCurrentPlaylistDetails({
                  id: playListId,
                  name: playlistName,
                  startIndex: myPlaylist.findIndex(
                    item => item.url === selectedTrack.url,
                  ),
                  endIndex: myPlaylist.length,
                });
                setCurrentPlaylistID(playListId);
                setShowPlayer(true);
              }
            }}>
            <View>
              <Image style={styles.audio_image} source={audioIcon} />
            </View>
            <View style={styles.flexShrink}>
              <Text style={styles.audio_title}>
                {removeExtraSpace(title).length > 50
                  ? removeExtraSpace(title).slice(0, 50) + '...'
                  : removeExtraSpace(title)}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.opDotContainer}
            onPress={() => {
              setShowOptions(true);
              setSelectedAudio(allData);
            }}>
            <View style={styles.opDot} />
            <View style={styles.opDot} />
            <View style={styles.opDot} />
          </TouchableOpacity>
        </View>

        {showPlayer && (
          <MusicPlayerModal
            playlist={currentPlaylist}
            selectedTrack={selectedTrack}
            isVisible={showPlayer}
            close={() => setShowPlayer(false)}
            playlistId={playListId}
            coverArt={coverArt}
          />
        )}
      </View>
    );
  },
);

const Audios = ({route, navigation}: any) => {
  const {userInfo, token, isPlayerActive, isConnected, subStatus, LogOutStep1, setLastActiveTrack} =
    useContext(AuthContext);

    const {
      playListId,
      url,
      name,
      categoryName,
      showCategoryName = true,
    } = route.params;

  const [playlistDetails, setPlaylistDetails] = useState({
    name: name,
    thumbnail: url,
    category: '',
    membership_type: '',
  });

  const [audioData, setAudioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (
      playlistDetails.membership_type.toLowerCase() == 'paid' &&
      subStatus == 'free'
    ) {
      setShowPop(true);
    }
  }, [playlistDetails]);

  const refreshData = () => {
    setIsRefreshing(true);
    getPlaylistAudios();
  };

  useEffect(() => {
    getPlaylistAudios();

    console.log('isConnected:', isConnected);
  }, [isConnected]);

  const getPlaylistAudios = () => {
    const url = `${baseURL}${
      ENDPOINT.AUDIO
    }/${playListId}?time=${new Date().getTime()}`;
    setIsLoading(true);
    axios
      .get(url, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setAudioData(res.data.data);
        setPlaylistDetails({
          name: res.data.title,
          thumbnail: res.data.thumbnail,
          category: res.data.categories[0],
          membership_type: res.data.membership_type,
        });
      })
      .catch(err => {
        console.log('error fetching playlist audios', err.response.data);
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
        setIsRefreshing(false);
      });
  };

  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
    audioData,
  );

  const layoutProvider = new LayoutProvider(
    index => 0,
    (type, dim) => {
      dim.width = Dimensions.get('window').width;
      dim.height = 60; // Adjust according to your item height
    },
  );

  const rowRenderer = (type, data) => (
    <Audio
      allData={data}
      title={data.name}
      url={data.url}
      playlist={audioData}
      playListId={playListId}
      setShowOptions={setShowOptions}
      setSelectedAudio={setSelectedAudio}
      coverArt={playlistDetails.thumbnail}
      playlistName={playlistDetails.name}
    />
  );

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.BASE} />
        <Header bgColor={COLORS.BASE} color={COLORS.TEXT} />
        <SearchBar padding={15} />
        {isConnected ? (
          <View style={styles.sub_container}>
            <View style={styles.playlist_details_container}>
              {isLoading ? (
                <View style={styles.loaderBox}>
                  <ActivityIndicator size={58} color={COLORS.PRIMARY} />
                </View>
              ) : (
                <Image
                  style={styles.playlist_image}
                  source={
                    playlistDetails.thumbnail
                      ? {uri: playlistDetails.thumbnail}
                      : url
                      ? {uri: url}
                      : require('../../../assets/image/amotaudio.png')
                  }
                />
              )}
              <View style={styles.flexShrink}>
                {showCategoryName && (
                  <Text style={styles.category_name}>
                    {playlistDetails.category}
                  </Text>
                )}

                <Text style={styles.playlist_name}>{playlistDetails.name}</Text>
              </View>
            </View>

            <View style={styles.container}>
              {isLoading ? (
                <View
                  style={{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{marginBottom: 160}}>
                    <ActivityIndicator size={58} color={COLORS.PRIMARY} />
                  </View>
                </View>
              ) : audioData?.length == 0 || !audioData ? (
                <Text style={styles.noDownloads}>No tracks found</Text>
              ) : (
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={layoutProvider}
                  rowRenderer={rowRenderer}
                  scrollViewProps={{
                    refreshControl: (
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refreshData}
                        colors={[COLORS.SECONDARY]}
                        progressBackgroundColor={COLORS.BASE}
                      />
                    ),
                  }}
                />
              )}
            </View>
          </View>
        ) : (
          <NoInternet />
        )}

        <View style={{height: isPlayerActive ? 82 : 0}} />
      </View>

      <OptionModal
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        selectedAudio={selectedAudio}
        setSelectedAudio={setSelectedAudio}
        playListId={playListId}
        userId={userInfo?.user_id}
        token={token}
      />

      <PurchaseMembership
        hidePop={() => {
          navigation.goBack();
          setShowPop(false);
        }}
        showPopUp={showPop}
      />
    </SafeAreaView>
  );
};

export default Audios;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  main_container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  flexShrink: {
    flexShrink: 1,
  },
  sub_container: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: '4%',
    paddingRight: '4%',
    marginTop: 10,
  },
  category_name: {
    color: COLORS.TEXT,
    fontSize: 22,
    fontFamily: FONTS.BOLD,
    marginBottom: '8%',
  },
  playlist_name: {
    color: COLORS.PRIMARY,
    fontSize: 20,
    fontFamily: FONTS.BOLD,
  },
  single_audio_container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
  },
  audio_image: {
    width: 35,
    borderRadius: 100,
    height: 35,
    marginRight: 16,
  },
  audio_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
  },
  playlist_details_container: {
    width: '100%',
    flexDirection: 'row',
    gap: 20,
    marginBottom: '10%',
  },
  playlist_image: {
    width: 108,
    height: 108,
    resizeMode: 'contain',
  },
  opDot: {
    width: 4,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 100,
  },
  opDotContainer: {
    height: 24,
    justifyContent: 'space-between',
    width: '10%',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: FONTS.REGULAR,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5) ',
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerModalContainer: {
    width: '100%',
    backgroundColor: 'black',
    paddingTop: 32,
    paddingBottom: 32,
  },
  wideMarker: {
    height: 6,
    width: '16%',
    backgroundColor: '#696969',
    alignSelf: 'center',
    margin: 16,
    marginTop: 0,
    borderRadius: 1000,
  },
  HR: {
    width: '90%',
    height: 1,
    backgroundColor: '#696969',
    alignSelf: 'center',
    margin: 16,
  },
  noDownloads: {
    fontSize: 18,
    marginTop: 180,
    color: COLORS.TEXT,
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
  },
  loaderBox: {
    width: 108,
    height: 108,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
