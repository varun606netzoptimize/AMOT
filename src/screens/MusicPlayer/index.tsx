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
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// ** Third Party Imports
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEntypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/FontAwesome';

// ** Component Imports
import Header from '../../components/musicPlayer/info';
import Playlist from '../../components/musicPlayer/playlist';
import {
  addTracks,
  setupPlayer,
} from '../../components/musicPlayer/trackPlayerServices';
import TrackProgress from '../../components/musicPlayer/progress';
import {AuthContext} from '../../context/AuthContext';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';
import TrackPlayer, {STATE_BUFFERING} from 'react-native-track-player';

// ** Assets
const musicIcon = require('../../../assets/image/playlistThumbnail.png');

const MusicPlayer = ({navigation, route}: any) => {
  console.log('MusicPlayer');

  const {playlist, selectedTrack} = route?.params;

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const {logOut} = useContext(AuthContext);

  useEffect(() => {
    setup();

    const stateSubscription = TrackPlayer.addEventListener(
      'playback-state',
      state => {
        if (state.state === STATE_BUFFERING) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      },
    );

    return () => {
      stateSubscription.remove();
    };
  }, []);

  async function setup() {
    let isSetup = await setupPlayer(isConnected);

    if (isSetup) {
      const tracks = playlist.map((item: any, index: number) => ({
        id: String(index),
        url: item.url,
        title: item.name,
        duration: 2400,
        artwork: musicIcon,
      }));

      await addTracks(tracks);
      const selectedTrackIndex = playlist.findIndex(
        (item: any) => item.url === selectedTrack.url,
      );
      if (selectedTrackIndex !== -1) {
        await TrackPlayer.skip(selectedTrackIndex);
        await TrackPlayer.play();
      }
    }

    setIsPlayerReady(isSetup);
  }

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.main_container}>
        <ActivityIndicator size={70} color={COLORS.SECONDARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.minimizeTitle}>
        <TouchableOpacity
          style={{position: 'absolute', left: 0}}
          onPress={() => navigation.goBack()}>
          <Icon size={28} color={'white'} name="angle-down" />
        </TouchableOpacity>

        <Text style={styles.playlist_title}>
          2023 Emotional Sobriety Conference
        </Text>
      </View>
      <Header />
      <TrackProgress />
      <Playlist loading={loading} />
      <Modal
        visible={showDownloadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDownloadModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDownloadModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={handleDownloadPress}
                style={styles.downloadButton}>
                <View style={styles.download_container}>
                  <IconAntDesign size={20} color={'white'} name="download" />
                  <Text style={styles.downloadButtonText}>Download</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={logOut} style={styles.downloadButton}>
                <View style={styles.logout_container}>
                  <IconEntypo size={20} color={'white'} name="log-out" />
                  <Text style={styles.downloadButtonText}>Log Out</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
