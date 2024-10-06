/* eslint-disable prettier/prettier */
//  ** React Imports
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useContext, useEffect} from 'react';

// ** Component Imports
import {SCREENS} from '../../constants';
import {AuthContext} from '../../context/AuthContext';
import Audios from '../../screens/Audios';
import FreeRecording from '../../screens/FreeRecording';
import Login from '../../screens/Login';
import MusicPlayer from '../../screens/MusicPlayer';
import Playlists from '../../screens/Playlists';
import FirstStep from '../../screens/Register/firstStep';
import SecondStep from '../../screens/Register/secondStep';
import Search from '../../screens/Search';
import TabNavigation from '../Tab';

import BlankScreen from '../../components/BlankScreen';
import SubCategory from '../../screens/SubCategory';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  LandingPage: undefined;
};

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const {token, isTokenLoading} = useContext(AuthContext);

  const rightToLeftAnimation = 'slide_from_right';

  let navigationStack = (
    <>
      <Stack.Screen
        name={SCREENS.LOGIN}
        component={Login}
        options={{
          animation: rightToLeftAnimation,
        }}
      />

      <Stack.Screen
        name={SCREENS.REGISTER_FIRST_STEP}
        component={FirstStep}
        options={{
          animation: rightToLeftAnimation,
        }}
      />
      <Stack.Screen
        name={SCREENS.REGISTER_SECOND_STEP}
        component={SecondStep}
        options={{
          animation: rightToLeftAnimation,
        }}
      />
    </>
  );

  if (isTokenLoading) {
    navigationStack = (
      <Stack.Screen
        name={'BlankScreen'}
        component={BlankScreen}
        options={{
          animation: rightToLeftAnimation,
        }}
      />
    );
  }

  if (token) {
    navigationStack = (
      <>
        <Stack.Screen
          name={SCREENS.TABS}
          component={TabNavigation}
          options={{headerShown: false, animation: rightToLeftAnimation}}
        />
        <Stack.Screen
          name={SCREENS.FREE_RECORDING}
          component={FreeRecording}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
        <Stack.Screen
          name={SCREENS.PLAYLISTS}
          component={Playlists}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
        <Stack.Screen
          name={SCREENS.AUDIOS}
          component={Audios}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
        <Stack.Screen
          name={SCREENS.MUSIC_PLAYER}
          component={MusicPlayer}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
        <Stack.Screen
          name={SCREENS.SEARCH}
          component={Search}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
        <Stack.Screen
          name={SCREENS.SUB_CATEGORY}
          component={SubCategory}
          options={{
            animation: rightToLeftAnimation,
          }}
        />
      </>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {navigationStack}
    </Stack.Navigator>
  );
};

export default StackNavigation;
