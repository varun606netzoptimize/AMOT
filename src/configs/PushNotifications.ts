import messaging from '@react-native-firebase/messaging';
import NavigationService from './NavigationService';
import {SCREENS} from '../constants';
import notifee, {EventType} from '@notifee/react-native';

export const NotificationServices = () => {
  messaging().onMessage(async (remoteMessage: any) => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  const handleNotificationOpen = remoteMessage => {
    console.log('Notification caused app to open idhar:', remoteMessage);

    const playlistString = remoteMessage?.data?.playlist;
    const playlistArray = JSON.parse(playlistString);
    const playlistId = playlistArray[0];

    NavigationService.navigate(SCREENS.AUDIOS, {
      playListId: playlistId,
      autoPlay: true,
    });
  };

  messaging().onNotificationOpenedApp(remoteMessage => {
    handleNotificationOpen(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationOpen(remoteMessage);
      }
    });

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      handleNotificationOpen(detail.notification);
    }
  });

  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      handleNotificationOpen(detail.notification);
    }
  });
};
