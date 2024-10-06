/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
// ** React Imports
import {useEffect, useState, useRef, useContext} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// ** Third Party Imports
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {COLORS, FONTS} from '../../constants';

import Playlist from './playlist';
import TrackProgress from './progress';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../../context/AuthContext';

function Header({
  playlistId = null,
  selectedTrack = null,
  StartAnimationFN,
  activePosition,
  onClose,
}: any) {
  const {currentPlaylistDetails} = useContext(AuthContext);

  const [info, setInfo] = useState<any>('');
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    handleSetTrackInfo();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
    if (event.state == State.nextTrack) {
      handleSetTrackInfo();
    }
  });

  async function handleSetTrackInfo() {
    const track = await TrackPlayer.getCurrentTrack();
    const info = await TrackPlayer.getTrack(track);
    setInfo(info);
  }

  const removeExtraSpace = (text: any) => text?.trim()?.split(/ +/)?.join(' ');

  return (
    <>
      <View style={styles.main_container}>
        <TouchableOpacity
          style={styles.minimizeTitle}
          onPress={() => {
            onClose();
          }}>
          <View style={{position: 'absolute', left: 12, top: -4}}>
            <Icon size={36} color={'white'} name="angle-down" />
          </View>
          <Text style={styles.playlist_title}>
            {info?.playlistName
              ? info?.playlistName
              : currentPlaylistDetails.name}
          </Text>
        </TouchableOpacity>

        <Animated.View
          style={{...styles.trackInfoContainer, transform: [{translateX}]}}>
          {info && info?.artwork ? (
            <Image
              style={styles.audio_image}
              source={{
                uri: info?.artwork,
              }}
            />
          ) : null}
          <View style={styles.sub_container}>
            <Text style={styles.artistName}>Now Playing</Text>
            <Text style={styles.songTitle}>
              {removeExtraSpace(info?.title)?.length > 40
                ? removeExtraSpace(info?.title)?.slice(0, 40) + ' . . .'
                : removeExtraSpace(info?.title)}
            </Text>
          </View>
        </Animated.View>
      </View>
      <TrackProgress activePosition={activePosition} />
      <Playlist
        playlistId={playlistId}
        selectedTrack={selectedTrack}
        trackTranslateX={translateX}
        StartAnimationFN={StartAnimationFN}
        displayHeart={
          info?.playlistName
            ? info.playlistName === 'Downloaded Audio'
              ? false
              : true
            : currentPlaylistDetails.name === 'Downloaded Audio'
            ? false
            : true
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  main_container: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  sub_container: {
    width: '100%',
    alignSelf: 'center',
  },
  trackProgress: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    color: '#eee',
  },
  songTitle: {
    fontSize: 18,
    color: COLORS.TEXT,
    fontFamily: FONTS.BOLD,
    textAlign: 'center',
    width: Dimensions.get('window').width - 16
  },
  artistName: {
    fontSize: 16,
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    textAlign: 'center',
    padding: '2%',
  },
  audio_image: {
    width: 340,
    height: 340,
    alignSelf: 'center',
  },
  minimizeTitle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  playlist_title: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: 20,
    textAlign: 'center',
    width: 266,
    lineHeight: 24,
  },
});
export default Header;
