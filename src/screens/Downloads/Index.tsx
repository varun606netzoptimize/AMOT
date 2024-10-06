/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  SafeAreaView,
} from 'react-native';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';
import {ScrollView} from 'react-native-virtualized-view';

// ** Context and Component Imports
import {AuthContext} from '../../context/AuthContext';
import MusicPlayerModal from '../MusicPlayerModal';
import RNFS from 'react-native-fs';

import {useActiveTrack, useProgress} from 'react-native-track-player';

const audioIcon = require('../../../assets/image/audioImage.png');
// import IconAntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TrackPlayer from 'react-native-track-player';

const Downloads: React.FC<{navigation: any}> = ({navigation}) => {
  const {
    downloaded,
    fetchAudioFiles,
    setupMusicPlayer,
    isPlayerActive,
    currentDownloading,
    userInfo,
    SetCurrentPlaylistDetails,
    setLastActiveTrack
  } = useContext<any>(AuthContext);

  const [selectedTrack, setSelectedTrack] = useState({});
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  const activeTrack = useActiveTrack();
  const {position} = useProgress(200);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAudioFiles(userInfo?.user_id);
      deleteExpiredTracks();
    });

    return unsubscribe;
  }, [navigation]);

  const deleteExpiredTracks = async () => {
    try {
      const currentTime = new Date().getTime();
      await Promise.all(
        downloaded.map(async track => {
          const stat = await RNFS.stat(track);
          const modificationTime = new Date(stat.mtime).getTime();
          const elapsedTime = currentTime - modificationTime;
          if (elapsedTime > 7 * 24 * 60 * 60 * 1000) {
            await RNFS.unlink(track);
          }
        }),
      );
      fetchAudioFiles(userInfo?.user_id);
    } catch (error) {
      console.log('Error deleting expired tracks:', error);
    }
  };

  const showAlert = (track, fileName) => {
    Alert.alert(
      'Delete Track?',
      `Are you sure you want to delete "${removeExtraSpace(fileName)}"?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteTrack(track, fileName)},
      ],
      {cancelable: false},
    );
  };


  const deleteTrack = async (track: string, fileName: string) => {
    try {
      console.log(fileName == activeTrack?.title)

      if (isPlayerActive && fileName == activeTrack?.title) {
        TrackPlayer.reset();
        setLastActiveTrack()
      }

      await RNFS.unlink(track);
      fetchAudioFiles(userInfo?.user_id);
      // ToastAndroid.show('Track Deleted', ToastAndroid.SHORT);
    } catch (error) {
      console.log('Error deleting track:', error, track);
    }
  };

  const downloadedFiles = downloaded?.map(filePath => {
    const parts = filePath.split('/');
    const fileName = parts.pop().replace('.mp3', '');

    return {url: filePath, name: fileName};
  });

  const rearrangeArray = (arr, clickedElementUrl) => {
    const index = arr.findIndex(item => item.url === clickedElementUrl);
    if (index === -1) return arr; // If the clicked element is not in the array, return the original array

    const firstPart = arr.slice(index); // Elements from the clicked element to the end
    const secondPart = arr.slice(0, index); // Elements from the start to just before the clicked element

    return firstPart.concat(secondPart); // Concatenate the two parts
  };

  const removeExtraSpace = (text: any) => text.trim().split(/ +/).join(' ');

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <View>
          <Text style={styles.header}>Downloads</Text>
          <Text style={styles.infoText}>
            Downloaded audio files are available to listen to for 7 days.
            Maximum of 10 downloads.
          </Text>
          <View style={styles.hr} />
        </View>

        {(downloaded?.length == 0 || !downloaded) && (
          <View style={styles.noDownloadBox}>
            <Text style={styles.noDownloads}>No Downloads Available</Text>
          </View>
        )}

        <ScrollView>
          {downloadedFiles?.map((item: string, i: number) => {
            let track = item.url;
            let fileName = item.name;

            let playlist = downloadedFiles;
            let myTrack = {url: track, title: fileName};

            if (`${currentDownloading}` == fileName) {
              return null;
            }

            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[
                    styles.single_audio_sub_container,
                    {marginTop: i === 0 ? 0 : 8},
                  ]}
                  onPress={() => {
                    const newPlaylist = rearrangeArray(playlist, myTrack.url);

                    if (isPlayerActive) {
                      setupMusicPlayer(newPlaylist, myTrack);
                      SetCurrentPlaylistDetails({
                        id: '',
                        name: 'Downloaded Audio',
                      });
                    } else {
                      SetCurrentPlaylistDetails({
                        id: '',
                        name: 'Downloaded Audio',
                      });
                      setShowPlayerModal(true);
                      setSelectedPlaylist(newPlaylist);
                      setSelectedTrack(myTrack);
                    }
                  }}>
                  <View>
                    <Image source={audioIcon} style={styles.audio_image} />
                  </View>
                  <Text style={styles.audio_title}>
                    {removeExtraSpace(fileName).length > 40
                      ? removeExtraSpace(fileName).slice(0, 40) + '...'
                      : removeExtraSpace(fileName)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showAlert(track, fileName)}>
                  <MaterialCommunityIcons
                    color={'white'}
                    name="delete"
                    size={24}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
          <View style={{height: 82}} />
        </ScrollView>

        {showPlayerModal && (
          <MusicPlayerModal
            playlist={selectedPlaylist}
            selectedTrack={selectedTrack}
            isVisible={showPlayerModal}
            close={() => setShowPlayerModal(false)}
            activePosition={position}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Downloads;

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
  },
  infoText: {
    fontFamily: FONTS.REGULAR,
    color: 'white',
    fontSize: 18,
    marginTop: 18,
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: '#696969',
    alignSelf: 'center',
    margin: 28,
  },
  audio_image: {
    width: 35,
    borderRadius: 100,
    height: 35,
  },
  audio_title: {
    flexShrink: 1,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
  },
  single_audio_sub_container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 8,
    width: '90%'
  },
  noDownloads: {
    fontSize: 18,
    marginTop: 180,
    color: COLORS.TEXT,
    textAlign: 'center',
    fontFamily: FONTS.REGULAR,
  },
});
