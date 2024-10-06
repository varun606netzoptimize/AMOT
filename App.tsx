/* eslint-disable prettier/prettier */
//  ** React Imports
import React, {forwardRef, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

// ** Third Party Imports
import {Provider} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import Toast, {ToastProps} from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';

// ** Component Imports
import {store} from './src/redux/store';
import StackNavigation from './src/navigation/Stack';
import {AuthProvider} from './src/context/AuthContext';
import {NotificationServices} from './src/configs/PushNotifications';
import NavigationService from './src/configs/NavigationService';
import notifee, {EventType} from '@notifee/react-native';

interface ToastWithRefProps extends ToastProps {
  ref?: React.Ref<HTMLDivElement>;
}

const ToastWithRef = forwardRef<HTMLDivElement, ToastWithRefProps>(
  (props, ref) => <Toast ref={ref} {...props} />,
);

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    createNotificationChannel();
    NotificationServices();
  }, []);

  async function createNotificationChannel() {
    try {
      await notifee.createChannel({
        id: 'download-progress',
        name: 'Download Progress',
        lights: false,
        vibration: false,
      });
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }

  return (
    <View style={styles.main_container}>
      {/* Status bar */}

      <StatusBar barStyle={'light-content'} backgroundColor={'#CADB29'} />

      {/* Redux Provider */}
      <Provider store={store}>
        {/* Context Provider */}
        <AuthProvider>
          {/* Navigation */}
          <NavigationContainer
            ref={ref => NavigationService.setTopLevelNavigator(ref)}>
            <StackNavigation />
          </NavigationContainer>
        </AuthProvider>
      </Provider>

      {/* Toast */}
      <ToastWithRef position="top" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
});
