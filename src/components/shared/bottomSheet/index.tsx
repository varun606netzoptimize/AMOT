/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// ** React Imports
import React, {forwardRef, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import * as Progress from 'react-native-progress';

import {COLORS, ENDPOINT, FONTS} from '../../../constants';
import {AuthContext} from '../../../context/AuthContext';

const baseURL = process.env.BASE_URL;

const BottomSheet = forwardRef((props, ref) => {
  const {trackData, isRemoving, setIsRemoving} = props;

  console.log(trackData)

  const trackName = trackData.track.name;

  const {
    token,
    downloaded,
    fetchAudioFiles,
    StartDownloadFN,
    isDownloading,
    downloadProgress,
    userInfo,
    getFavTracks,
    subStatus,
  } = useContext(AuthContext);

  const removeFavourite = async postId => {
    const url = `${baseURL}${ENDPOINT.REMOVE_FAVOURITE}`;
    const config = {
      headers: {Authorization: `Bearer ${token}`},
      data: {post_id: postId.toString()},
    };
    setIsRemoving(true);
    try {
      const response = await axios.delete(url, config);
      console.log('Track removed from my amot:', response.data);
      getFavTracks(userInfo?.user_id).then(() => {
        setIsRemoving(false);
      });
    } catch (error) {
      setIsRemoving(false);
      console.log('Error:', error, userInfo?.user_id);
    }
  };

  useEffect(() => {
    fetchAudioFiles(userInfo?.user_id);
  }, []);

  const fileNames = downloaded?.map(filePath => {
    const parts = filePath.split('/');
    return parts.pop();
  });

  const cleanedFileNames = fileNames?.map((name: any) =>
    name.replace(/\s+/g, ''),
  );

  return (
    <RBSheet
      ref={ref}
      draggable={true}
      customStyles={{
        wrapper: {backgroundColor: '#000000b7', flex: 1},
        draggableIcon: {
          backgroundColor: '#696969',
          width: '15%',
          marginTop: '5%',
        },
        container: {height: '30%', backgroundColor: COLORS.BASE},
      }}
      customModalProps={{animationType: 'slide', statusBarTranslucent: true}}
      customAvoidingViewProps={{enabled: false}}>
      <View style={styles.main_container}>
        <View style={styles.sub_container}>
          <Image
            style={styles.audio_image}
            source={require('../../../../assets/image/audioImage.png')}
          />
          <Text style={styles.audio_text}>
            {trackName?.length > 28
              ? trackName?.slice(0, 28) + '...'
              : trackName}
          </Text>
        </View>
        <View style={styles.border_container}>
          <View style={styles.border} />
        </View>
        <View style={styles.action_container}>
          <TouchableOpacity onPress={() => removeFavourite(trackData.post_id)} disabled={isRemoving}>
            <View style={styles.add_to_fav_container}>
              <IconAntDesign
                color={isRemoving ? COLORS.TEXT : COLORS.PRIMARY}
                name="heart"
                size={30}
              />
              <Text
                style={[
                  styles.action_text,
                  {color: isRemoving ? COLORS.TEXT : COLORS.PRIMARY},
                ]}>
                {isRemoving
                  ? 'Removing from My AMOT...'
                  : 'Remove from My AMOT'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (subStatus == 'free') {
                Alert.alert('Get access to downloads with a paid membership');
              } else {
                if (isDownloading.isDownloading) {
                  Alert.alert(`"${isDownloading.track.trim().split(/ +/).join(' ')}" download in progress`);
                } else {
                  StartDownloadFN(trackData.track.url, trackName);
                }
              }
            }}
            disabled={
              downloaded?.length >= 10 ||
              cleanedFileNames?.includes(trackName.replace(/\s+/g, '') + '.mp3')
            }>
            <View style={styles.download_container}>
              {isDownloading.isDownloading &&
              isDownloading.track === trackName ? (
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
                      trackName.replace(/\s+/g, '') + '.mp3',
                    ) ||
                    (isDownloading.isDownloading &&
                      isDownloading.track === trackName)
                      ? COLORS.PRIMARY
                      : downloaded?.length >= 10
                      ? 'grey'
                      : COLORS.TEXT
                  }
                  name={
                    cleanedFileNames?.includes(trackName.replace(/\s+/g, '') + '.mp3')
                      ? 'checkcircle'
                      : 'download'
                  }
                  size={30}
                />
              )}
              <Text
                style={[
                  styles.action_text,
                  {
                    color:
                      cleanedFileNames?.includes(
                        trackName.replace(/\s+/g, '') + '.mp3',
                      ) ||
                      (isDownloading.isDownloading &&
                        isDownloading.track === trackName)
                        ? COLORS.PRIMARY
                        : downloaded?.length >= 10
                        ? 'grey'
                        : COLORS.TEXT,
                  },
                ]}>
                {downloaded?.length >= 10
                  ? 'Download limit reached'
                  : isDownloading.isDownloading &&
                    isDownloading.track === trackName
                  ? 'Downloading Track...'
                  : cleanedFileNames?.includes(trackName.replace(/\s+/g, '') + '.mp3')
                  ? 'Download Complete'
                  : 'Download for offline listening'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </RBSheet>
  );
});

const styles = StyleSheet.create({
  main_container: {flex: 1, backgroundColor: COLORS.BASE},
  sub_container: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginLeft: '5%',
  },
  audio_text: {fontFamily: FONTS.BOLD, fontSize: 18, color: COLORS.TEXT},
  audio_image: {width: 35, borderRadius: 5, height: 35},
  border_container: {alignItems: 'center'},
  border: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.TEXT,
    marginTop: '5%',
    width: '85%',
  },
  action_container: {marginLeft: '5%', marginTop: '8%', gap: 25},
  add_to_fav_container: {flexDirection: 'row', alignItems: 'center', gap: 25},
  download_container: {flexDirection: 'row', alignItems: 'center', gap: 25},
  action_text: {fontFamily: FONTS.REGULAR, fontSize: 16, color: COLORS.TEXT},
});

export default BottomSheet;
