/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//  ** React Imports
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ** Dimensions Imports
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../themes/Metrics';

// ** Third Party Imports
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';

// ** Constant Imports
import {
  DEVICE,
  COLORS,
  SCREENS,
  KEYBOARD,
  FONTS,
  ENDPOINT,
} from '../../constants';

// ** Component Imports
import {login} from '../../redux/slices/login';
import {
  Button,
  Checkbox,
  TextField,
  PasswordTextInput,
} from '../../components/custom';
import {AuthContext} from '../../context/AuthContext';
import {RootStackParamList} from '../../navigation/Stack';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';

// ** Types Imports
import {FormData} from '../../@types';

// ** Assets
const logo = require('../../../assets/image/logo2.png');

// ** Interfaces
interface LoginProp {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

// ** Schema
const Schema = yup.object().shape({
  username: yup.string().required('Username is a required field'),
  password: yup.string().required('Password is a required field'),
  isRemember: yup.boolean(),
});

import axios from 'axios';
const baseURL = process.env.BASE_URL;

const Login = ({navigation}: LoginProp) => {
  const {deviceHeight, setToken, isConnected} = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {isLoggedIn} = useContext(AuthContext);
  const dispatch = useAppDispatch<AppDispatch>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loading = useAppSelector((state: any) => state.loginUser.loading);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({mode: 'onChange', resolver: yupResolver(Schema)});

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    dispatch(login(data)).then(() => isLoggedIn());
  };

  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

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
    <SafeAreaView style={styles.main_container}>
      <View
        style={[styles.top_container, {height: isKeyboardOpen ? '0%' : '30%'}]}>
        <Image style={styles.logo} source={logo} />
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View
          style={[
            styles.bottom_container,
            {height: isKeyboardOpen ? '100%' : '70%'},
          ]}>
          <View
            style={[
              styles.heading_container,
              {
                marginTop: deviceHeight <= 630 ? 8 : 28,
              },
            ]}>
            <Text style={styles.heading_first}>Login to</Text>
            <Text style={styles.heading_second}>The Listening Room</Text>
          </View>
          <View
            style={[
              styles.form_container,
              {
                marginTop: deviceHeight <= 630 ? 8 : 28,
              },
            ]}>
            <Text
              style={[
                styles.placeholder,
                {
                  marginBottom: deviceHeight <= 630 ? 6 : 15,
                },
              ]}>
              Enter username or email address
            </Text>
            <Controller
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <TextField
                  value={value}
                  onChangeText={text => onChange(text)}
                  keyboardType={
                    Platform.OS === DEVICE.IOS
                      ? KEYBOARD.KEYBOARD_TYPE.DEFAULT
                      : KEYBOARD.KEYBOARD_TYPE.VISIBLE
                  }
                  autoCapitalize="none"
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>
          <View
            style={[
              styles.password_container,
              {
                marginTop: deviceHeight <= 630 ? 8 : 28,
              },
            ]}>
            <Text
              style={[
                styles.placeholder,
                {
                  marginBottom: deviceHeight <= 630 ? 6 : 15,
                },
              ]}>
              Password
            </Text>
            <Controller
              control={control}
              defaultValue=""
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <PasswordTextInput
                  togglePasswordVisibility={togglePasswordVisibility}
                  value={value}
                  isVisible={showPassword}
                  onChangeText={text => onChange(text)}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
            {/* <View style={styles.terms_and_conditions_container}>
            <Controller
              control={control}
              name="isRemember"
              render={({field: {value, onChange}}) => (
                <Checkbox onPress={() => onChange(!value)} value={value} />
              )}
            />
            <View style={styles.terms_and_conditions_sub_container}>
              <Text style={styles.privacy_policy_text}>Remember me</Text>
            </View>
          </View> */}

            <View
              style={[
                styles.submit_container,
                {marginTop: deviceHeight <= 630 ? 16 : 30},
              ]}>
              <Button
                name={'Login'}
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                disabled={!isConnected}
              />
            </View>
          </View>
          {!isKeyboardOpen && (
            <View
              style={[
                styles.register_account_container,
                {bottom: deviceHeight <= 630 ? 10 : 28},
              ]}>
              <Text style={styles.register_account_heading}>
                Don’t have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.REGISTER_FIRST_STEP);
                  reset();
                }}>
                <Text style={styles.register_text}> Register here</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: COLORS.BASE,
  },
  top_container: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom_container: {
    width: '100%',
    backgroundColor: COLORS.BASE,
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    height: '52%',
    width: '52%',
  },
  heading_container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading_first: {
    color: COLORS.SECONDARY,
    fontSize: moderateScale(28),
    fontFamily: FONTS.REGULAR,
    paddingBottom: verticalScale(5),
  },
  heading_second: {
    fontSize: moderateScale(28),
    color: COLORS.SECONDARY,
    fontFamily: FONTS.BOLD,
  },
  placeholder: {
    fontFamily: FONTS.REGULAR,
    fontSize: moderateScale(16),
    color: COLORS.TEXT,
  },
  form_container: {
    width: '90%',
  },
  password_container: {
    width: '90%',
    position: 'relative',
  },
  errorText: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.REGULAR,
    color: COLORS.WARNING,
    marginTop: 8,
  },
  submit_container: {
    alignItems: 'center',
  },
  terms_and_conditions_container: {
    flexDirection: 'row',
    width: horizontalScale(390),
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  terms_and_conditions_sub_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  privacy_policy_text: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  register_account_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  register_account_heading: {
    fontFamily: FONTS.REGULAR,
    fontSize: moderateScale(16),
    color: COLORS.TEXT,
  },
  register_text: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: moderateScale(20),
  },
});
