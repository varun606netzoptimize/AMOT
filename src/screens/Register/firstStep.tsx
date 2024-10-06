/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//  ** React Imports
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

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

//  ** Constant Imports
import {DEVICE, COLORS, SCREENS, KEYBOARD, FONTS} from '../../constants';

// ** Component Imports
import Header from '../../components/shared/header';
import {Button, TextField} from '../../components/custom';
import {updateFormData} from '../../redux/slices/register';
import {AppDispatch, useAppDispatch} from '../../redux/store';
import {AuthContext} from '../../context/AuthContext';

// ** Assets
const logo = require('../../../assets/image/logo2.png');

// ** Interfaces
interface FormData {
  username: string;
  email: string;
}

// ** Schema
const Schema = yup.object().shape({
  username: yup.string().required('Username is a required field'),
  email: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email')
    .required('Email is a required field'),
});

const FirstStep = ({navigation}) => {
  const {deviceHeight, isConnected} = useContext(AuthContext);

  const dispatch = useAppDispatch<AppDispatch>();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormData>({mode: 'onChange', resolver: yupResolver(Schema)});

  const onSubmit = (data: object) => {
    dispatch(updateFormData(data));
    navigation.navigate(SCREENS.REGISTER_SECOND_STEP);
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
        <Header bgColor={COLORS.PRIMARY} color={COLORS.BASE} />
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
            <Text style={styles.heading_first}>Register for</Text>
            <Text style={styles.heading_second}>The Listening Room</Text>
          </View>
          <View
            style={[
              styles.form_container,
              {
                marginTop: deviceHeight <= 630 ? 8 : 28,
              },
            ]}>
            <Text style={styles.placeholder}>Enter username</Text>
            <Controller
              control={control}
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
          <View style={styles.email_container}>
            <Text style={styles.placeholder}>Email address</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <TextField
                  value={value}
                  onChangeText={text => onChange(text.toLowerCase())}
                  keyboardType={
                    Platform.OS === DEVICE.IOS
                      ? KEYBOARD.KEYBOARD_TYPE.DEFAULT
                      : KEYBOARD.KEYBOARD_TYPE.VISIBLE
                  }
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          <View
            style={[
              styles.submit_container,
              {
                marginTop: deviceHeight <= 630 ? 16 : 36,
              },
            ]}>
            <Button
              name={'Next'}
              onPress={handleSubmit(onSubmit)}
              disabled={!isConnected}
            />
          </View>

          {!isKeyboardOpen && (
            <View style={styles.existing_account_container}>
              <Text style={styles.existing_account_heading}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SCREENS.LOGIN);
                  reset();
                }}>
                <Text style={styles.existing_account_login_heading}>
                  {' '}
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FirstStep;

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
    marginBottom: 12,
  },
  form_container: {
    width: '90%',
  },
  email_container: {
    marginTop: 16,
    width: '90%',
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
  existing_account_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 28,
  },
  existing_account_heading: {
    fontFamily: FONTS.REGULAR,
    fontSize: moderateScale(16),
    color: COLORS.TEXT,
  },
  existing_account_login_heading: {
    fontFamily: FONTS.BOLD,
    color: COLORS.PRIMARY,
    fontSize: moderateScale(20),
  },
});
