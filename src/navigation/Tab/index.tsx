/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {Keyboard, Platform, Text, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

// ** Constant Imports
import {COLORS, SCREENS, FONTS, ENDPOINT} from '../../constants';

// ** Component Imports
import Home from '../../screens/Home';
import FreeRecording from '../../screens/FreeRecording';
import Audios from '../../screens/Audios';
import Search from '../../screens/Search';
import Playlists from '../../screens/Playlists';

import Downloads from '../../screens/Downloads/Index';
import Profile from '../../screens/Profile';
import Favorite from '../../screens/Favorites';
import Terms from '../../screens/Profile/Terms';
import Privacy from '../../screens/Profile/Privacy';
import EditProfile from '../../screens/Profile/EditProfile';
import Notifications from '../../screens/Profile/Notifications';

import {FloatingPlayer} from '../../components/musicPlayer/floatingPlayer';
import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet} from 'react-native';

import {getUniqueId} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import {requestNotifications} from 'react-native-permissions';

// ** Third Party Imports
import {useActiveTrack} from 'react-native-track-player';
import {useLastActiveTrack} from '../../components/hooks';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const rest_api_key = process.env.REST_API_KEY;
const baseURL = process.env.BASE_URL;
const subId = process.env.subscription_id;

import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';
import SubCategory from '../../screens/SubCategory';

const MyHomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'MyHome'} component={Home} />
      <Stack.Screen name={'FreeRecording'} component={FreeRecording} />
      <Stack.Screen name={'Audios'} component={Audios} />
      <Stack.Screen name={'Search'} component={Search} />
      <Stack.Screen name={'Playlists'} component={Playlists} />
      <Stack.Screen name={'SubCategory'} component={SubCategory} />
    </Stack.Navigator>
  );
};

const MyProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'MyProfile'} component={Profile} />
      <Stack.Screen name={'Terms'} component={Terms} />
      <Stack.Screen name={'Privacy'} component={Privacy} />
      <Stack.Screen name={'EditProfile'} component={EditProfile} />
      <Stack.Screen name={'Notifications'} component={Notifications} />
    </Stack.Navigator>
  );
};

const TabNavigation = () => {
  const {
    token,
    userInfo,
    SetNotificationFN,
    isConnected,
    setIsNotificationEnabled,
    subScribeNotifications,
  } = useContext(AuthContext);

  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();

  const displayedTrack = activeTrack ?? lastActiveTrack;

  useEffect(() => {
    if (userInfo) {
      requestNotifications(['alert', 'sound']).then(({status}: any) => {
        if (status == 'granted') {
          CheckStatus(userInfo.user_id);
        } else {
          setIsNotificationEnabled(false);
        }
      });
    }
  }, [userInfo]);

  async function CheckStatus(id: any) {
    const url = `${baseURL}${ENDPOINT.CHECK_NOTIFICATION_STATUS}${id}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(url, config);

      const notificationStatus = response.data.receive_notifications;

      if (notificationStatus == null) {
        getUniqueId().then((uuid: any) => {
          getDeviceToken(uuid);
        });
      } else if (notificationStatus == 'no') {
        setIsNotificationEnabled(false);
      } else if (notificationStatus == 'yes') {
        setIsNotificationEnabled(true);
        getUniqueId().then((uuid: any) => {
          getDeviceToken(uuid);
        });
      }
    } catch (err: any) {
      console.log('failed to check notification status:', err?.response?.data);
    }
  }

  const getDeviceToken = async (uuid: any) => {
    let deviceToken = await messaging().getToken()
    subScribeNotifications(uuid, deviceToken);

    SetNotificationFN('yes');
  };

  useEffect(() => {
    let keyboardShowListener;
    let keyboardHideListener;

    if (Platform.OS === 'ios') {
      keyboardShowListener = Keyboard.addListener(
        'keyboardWillShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardWillHide',
        _handleKeyboardHide,
      );
    } else {
      keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        _handleKeyboardShow,
      );
      keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        _handleKeyboardHide,
      );
    }

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  const _handleKeyboardShow = () => {
    setKeyboardOpen(true);
  };

  const _handleKeyboardHide = () => {
    setKeyboardOpen(false);
  };

  return (
    <>
      {!isConnected && !isKeyboardOpen && (
        <View
          style={[
            styles.noInternetBox,
            {
              bottom: displayedTrack ? 160 : 100,
            },
          ]}>
          <Text style={styles.noConnection}>
            Amot Audio is currently offline
          </Text>
        </View>
      )}

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.DARK,
            borderTopColor: 'transparent',
            height: 100,
          },
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: {
            fontSize: 10.5,
            marginBottom: 6,
            fontFamily: FONTS.REGULAR,
          },
        }}>
        <Tab.Screen
          name={SCREENS.HOME}
          component={MyHomeStack}
          options={{
            tabBarIcon: ({focused}) => (
              <IconAntDesign
                color={focused ? COLORS.PRIMARY : COLORS.TEXT}
                name="home"
                size={25}
              />
            ),
            tabBarActiveTintColor: COLORS.PRIMARY,
            tabBarInactiveTintColor: COLORS.TEXT,
          }}
        />
        <Tab.Screen
          name={SCREENS.FAVORITE}
          component={Favorite}
          options={{
            tabBarIcon: ({focused}) => (
              <IconAntDesign
                color={focused ? COLORS.PRIMARY : COLORS.TEXT}
                name="hearto"
                size={25}
              />
            ),
            tabBarActiveTintColor: COLORS.PRIMARY,
            tabBarInactiveTintColor: COLORS.TEXT,
          }}
        />
        <Tab.Screen
          name={SCREENS.DOWNLOAD}
          component={Downloads}
          options={{
            tabBarIcon: ({focused}) => (
              <IconAntDesign
                color={focused ? COLORS.PRIMARY : COLORS.TEXT}
                name="download"
                size={25}
              />
            ),
            tabBarActiveTintColor: COLORS.PRIMARY,
            tabBarInactiveTintColor: COLORS.TEXT,
          }}
        />
        <Tab.Screen
          name={SCREENS.PROFILE}
          component={MyProfileStack}
          options={{
            tabBarIcon: ({focused}) => (
              <IconAntDesign
                color={focused ? COLORS.PRIMARY : COLORS.TEXT}
                name="user"
                size={25}
              />
            ),
            tabBarActiveTintColor: COLORS.PRIMARY,
            tabBarInactiveTintColor: COLORS.TEXT,
          }}
        />
      </Tab.Navigator>
      {!isKeyboardOpen && <FloatingPlayer style={styles.floatingPlayer} />}
    </>
  );
};

const styles = StyleSheet.create({
  floatingPlayer: {
    position: 'absolute',
    bottom: 100,
    zIndex: 999,
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#6C6C6C',
  },
  noConnection: {
    fontFamily: FONTS.REGULAR,
    fontSize: 15,
    color: 'white',
    backgroundColor: COLORS.DARK,
  },
  noInternetBox: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 999,
    backgroundColor: COLORS.DARK,
    width: '100%',
    alignItems: 'center',
    padding: 4,
  },
});

export default TabNavigation;
