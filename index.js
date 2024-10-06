/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import {playbackService} from './src/components/musicPlayer/trackPlayerServices';

import messaging from '@react-native-firebase/messaging';
import NavigationService from './src/configs/NavigationService';
import {SCREENS} from './src/constants';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background index!', remoteMessage);
  if (remoteMessage) {
    const playlistString = remoteMessage?.data?.playlist;
    const playlistArray = JSON.parse(playlistString);
    const playlistId = playlistArray[0];

    NavigationService.navigate(SCREENS.AUDIOS, {
      playListId: playlistId,
      autoPlay: true,
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
