/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useContext} from 'react';

// ** Constant Imports
import {COLORS, FONTS} from '../../constants';
import {AuthContext} from '../../context/AuthContext';

// ** Third party imports
import TrackPlayer from 'react-native-track-player';

const Profile = ({navigation}: any) => {
  const {
    subStatus,
    LogOutStep1,
    isPlayerActive,
    logoutSpinner,
    setLastActiveTrack,
    isConnected,
    isDownloading
  } = useContext(AuthContext);

  const Options = [
    {
      name: 'Membership',
      action: () => console.log('Membership'),
    },
    {
      name: 'Edit account details',
      action: () => navigation.navigate('EditProfile'),
    },
    {
      name: 'Terms and Conditions',
      action: () => navigation.navigate('Terms'),
    },
    {
      name: 'Privacy Policy',
      action: () => navigation.navigate('Privacy'),
    },
    {
      name: 'Logout',
      action: () => {
        showAlert();
      },
    },
  ];

  const showAlert = () => {
    Alert.alert(
      'Logout?',
      'Are you sure you want to Logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            if (isConnected) {
              if (isDownloading.isDownloading) {
                Alert.alert('Download in progress, please wait.');
              } else {
                LogOutStep1();
                if (isPlayerActive) {
                  TrackPlayer.reset();
                  setLastActiveTrack();
                }
              }
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <Text style={styles.header}>Profile</Text>
        <View style={{marginTop: 48}}>
          {Options.map((data, i) => {
            return data.name == 'Membership' && !subStatus ? null : (
              <TouchableOpacity key={i} onPress={data.action}>
                <View style={styles.option_status_box}>
                  <Text style={styles.optionText}>{data.name}</Text>
                  {data.name == 'Membership' && (
                    <View style={styles.statusBG}>
                      <Text style={styles.statusText}>{subStatus}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.hr} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Modal transparent={true} visible={logoutSpinner}>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.75)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={'large'} color={COLORS.PRIMARY} />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

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
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: '#696969',
    alignSelf: 'center',
    margin: 24,
  },
  optionText: {
    fontFamily: FONTS.REGULAR,
    color: 'white',
    fontSize: 18,
  },
  option_status_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 14,
    color: 'black',
    textTransform: 'capitalize',
  },
  statusBG: {
    backgroundColor: COLORS.PRIMARY,
    padding: 22,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 6,
  },
});
