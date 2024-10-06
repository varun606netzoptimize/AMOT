/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useState} from 'react';

// ** Constant Imports
import {COLORS, FONTS, ENDPOINT} from '../../../constants';
// ** Third Party Imports
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, PasswordTextInput} from '../../../components/custom';
import {AuthContext} from '../../../context/AuthContext';
// ** Third Party Imports
import axios from 'axios';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

const baseURL = process.env.BASE_URL;

import TrackPlayer from 'react-native-track-player';

// ** Schema
const Schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is a required field')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is a required field')
    .oneOf([yup.ref('password'), ''], 'Passwords must match'),
});

const EditProfile = ({navigation}: any) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormData>({mode: 'onChange', resolver: yupResolver(Schema)});

  const {
    userInfo,
    token,
    setUserInfo,
    isConnected,
    LogOutStep1,
    isPlayerActive,
    setLastActiveTrack,
  } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data: FormData) => {
    updateUserDetails(data);
  };

  const updateUserDetails = data => {
    setIsLoading(true);

    const updateProfileUrl = `${baseURL}${ENDPOINT.UPDATE_PROFILE}`;

    const userData = {
      user_id: userInfo.user_id,
      newUsername: data.username,
      newPassword: data.password,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(updateProfileUrl, userData, config)
      .then(response => {
        console.log('Update successful:', response.data);

        getUserInfo(userInfo.user_id, token);
      })
      .catch(err => {
        console.log('Update failed:', err.response.data, updateProfileUrl);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
        reset();
        setIsLoading(false);
      });
  };

  const getUserInfo = async (userId, token) => {
    const url = `${baseURL}${ENDPOINT.USER_INFO}?id=${userId}`;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(url, config)
      .then(res => {
        setUserInfo(res.data);
        setIsLoading(false);
        Toast.show({
          type: 'info',
          text1: 'Profile Updated',
          text2: 'Profile updated successfully',
        });
      })
      .catch(err => {
        console.log('failed to get user info', err.response.data);
        if (err?.response?.data?.code == 'jwt_invalid') {
          Alert.alert('Session expired. Please login again');
          LogOutStep1();
          if (isPlayerActive) {
            TrackPlayer.reset();
            setLastActiveTrack();
          }
        }
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              reset();
            }}
            activeOpacity={0.7}
            style={styles.backBtnStyle}>
            <Icon name="arrow-back" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.header}>Account</Text>
        </View>

        <ScrollView style={{marginTop: 12}}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>

            <Text style={styles.labelText}>{userInfo?.user_display_name}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email address</Text>

            <Text style={styles.labelText}>{userInfo?.user_email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Change password</Text>

            <View style={{marginTop: 15}}>
              <Text style={styles.label2}>Enter new password</Text>
              <View style={{marginTop: 15}}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({field: {onChange, value}}) => (
                    <PasswordTextInput
                      value={value}
                      onChangeText={text => onChange(text)}
                    />
                  )}
                  name="password"
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={{marginTop: 30}}>
              <Text style={styles.label2}>Confirm new password</Text>
              <View style={{marginTop: 15}}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({field: {onChange, value}}) => (
                    <PasswordTextInput
                      value={value}
                      onChangeText={text => onChange(text)}
                    />
                  )}
                  name="confirmPassword"
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.btnContainer}>
              {isConnected && (
                <Button
                  name={'Save changes'}
                  loading={isLoading}
                  onPress={handleSubmit(onSubmit)}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

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
    alignSelf: 'center',
  },
  fieldContainer: {marginTop: 24},
  label: {fontFamily: FONTS.BOLD, fontSize: 18, color: COLORS.SECONDARY},
  label2: {fontFamily: FONTS.REGULAR, fontSize: 18, color: 'white'},
  headerBox: {
    alignItems: 'center',
    position: 'relative',
  },
  backBtnStyle: {
    position: 'absolute',
    left: 0,
    top: 2,
  },
  inputField1: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: COLORS.WARNING,
    marginTop: 4,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '12%',
  },
  labelText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
});
