/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

// ** Constant Imports
import {COLORS, FONTS, ENDPOINT} from '../../../constants';
// ** Third Party Imports
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {format, isToday, isYesterday, parseISO} from 'date-fns';

const baseURL = process.env.BASE_URL;
const rest_api_key = process.env.REST_API_KEY;
const subId = process.env.subscription_id;

import messaging from '@react-native-firebase/messaging';

import {getUniqueId} from 'react-native-device-info';
import {AuthContext} from '../../../context/AuthContext';

import {requestNotifications, openSettings} from 'react-native-permissions';

import {useFocusEffect} from '@react-navigation/native';

export default function Notifications({navigation}: any) {
  const {
    token,
    userInfo,
    SetNotificationFN,
    isNotificationEnabled,
    setIsNotificationEnabled,
    subScribeNotifications,
    unsubScribeNotifications,
    setNotificationLoader,
    notificationLoader,
  } = useContext(AuthContext);

  const [Notifications, setNotifications] = useState([]);

  const regex = /(<([^>]+)>)/gi;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GetNotifications();
  }, []);

  async function GetNotifications() {
    const url = `${baseURL}${
      ENDPOINT.GET_NOTIFICATIONS
    }?time=${new Date().getTime()}`;
    setIsLoading(true);

    try {
      const response = await axios.get(url);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function ToggleNotifications() {
    requestNotifications(['alert', 'sound']).then(({status, settings}: any) => {
      if (status == 'granted') {
        getUniqueId().then((uuid: any) => {
          getDeviceToken(uuid);
        });
      } else {
        Alert.alert(
          'Notification Permission',
          'To enable notifications, please go to the app settings and change the permissions.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => {
                navigation.goBack();
                openSettings();
              },
            },
          ],
        );
      }
    });
  }

  const getDeviceToken = async (uuid: any) => {
    let deviceToken = await messaging().getToken();

    if (!isNotificationEnabled) {
      subScribeNotifications(uuid, deviceToken);
      setIsNotificationEnabled(true);

      SetNotificationFN('yes');
    } else {
      getUniqueId().then((uuid: any) => {
        unsubScribeNotifications(uuid);
      });
      setIsNotificationEnabled(false);

      SetNotificationFN('no');
    }
  };

  const groupNotificationsByDate = (notifications: any) => {
    const grouped = notifications.reduce((acc, notification) => {
      const date = parseISO(notification.date);
      let key = format(date, 'MMMM dd, yyyy');

      if (isToday(date)) {
        key = 'Today';
      } else if (isYesterday(date)) {
        key = 'Yesterday';
      }

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(notification);
      return acc;
    }, {});

    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate(Notifications);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.BASE}}>
      <View style={styles.main_container}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.7}
            style={styles.backBtnStyle}>
            <Icon name="arrow-back" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.header}>Notifications</Text>
        </View>

        <View style={styles.headerSwitchBox}>
          <Text style={styles.headingText}>Receive notifications</Text>
          <Switch
            trackColor={{false: '#767577', true: '#767577'}}
            thumbColor={isNotificationEnabled ? '#CADB29' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            value={isNotificationEnabled}
            onValueChange={ToggleNotifications}
          />
        </View>

        {isNotificationEnabled ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={GetNotifications}
                colors={[COLORS.PRIMARY]}
                progressBackgroundColor={COLORS.BASE}
              />
            }>
            {Object.keys(groupedNotifications).map((date, index) => (
              <View key={index} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {groupedNotifications[date].map((notification, i) => (
                  <View key={i} style={styles.notification_text}>
                    <Text style={styles.notification_title}>
                      {notification?.title?.rendered}
                    </Text>
                    <Text style={styles.notification_desc}>
                      {notification?.content?.rendered
                        .replace(regex, '')
                        .trim()}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            <View style={{height: 72}} />
          </ScrollView>
        ) : (
          <View style={styles.blankBox}>
            <Text style={styles.disabledText}>Notifications disabled</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.BASE,
    padding: 15,
    paddingBottom: 0,
  },
  headerBox: {
    alignItems: 'center',
    position: 'relative',
  },
  backBtnStyle: {
    position: 'absolute',
    left: 0,
    top: 2,
  },
  header: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: 22,
    alignSelf: 'center',
  },
  headingText: {
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    fontSize: 18,
    alignSelf: 'center',
  },
  disabledText: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 18,
    alignSelf: 'center',
  },
  headerSwitchBox: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#6B6B6B',
    paddingBottom: 22,
    paddingLeft: 2,
    paddingRight: 2,
  },
  notification_title: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 16,
    lineHeight: 22,
  },
  notification_desc: {
    fontFamily: FONTS.REGULAR,
    color: '#AEAEAE',
    fontSize: 14,
    lineHeight: 22,
  },
  notification_text: {
    marginTop: 10,
  },
  dateHeader: {
    fontFamily: FONTS.BOLD,
    color: '#56C5EC',
    fontSize: 18,
    lineHeight: 20,
    marginTop: 28,
  },
  blankBox: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
