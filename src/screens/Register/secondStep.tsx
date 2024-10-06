/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
//  ** React Imports
import React, {useContext, useState, useEffect} from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Alert,
  Linking,
  TouchableWithoutFeedback
} from 'react-native';

// ** Dimensions Imports
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../themes/Metrics';

// ** Third Party Imports
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';

//  ** Constant Imports
import {COLORS, FONTS} from '../../constants';

// ** Component Imports
import {Button, Checkbox, PasswordTextInput} from '../../components/custom';
import {Header} from '../../components/shared';
import {AuthContext} from '../../context/AuthContext';
import {register} from '../../redux/slices/register';
import {AppDispatch, useAppDispatch, useAppSelector} from '../../redux/store';

// ** Assets
const logo = require('../../../assets/image/logo2.png');

// ** Interfaces
interface FormData {
  password: string;
  confirmPassword: string;
}

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

const SecondStep = () => {
  const {isLoggedIn, deviceHeight, isConnected} = useContext(AuthContext);
  const dispatch = useAppDispatch<AppDispatch>();

  const formData = useAppSelector((state: any) => state.registerUser);
  const loading = useAppSelector((state: any) => state.registerUser.loading);
  const [termsAccept, setTermsAccept] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({mode: 'onChange', resolver: yupResolver(Schema)});

  const onSubmit = (data: FormData) => {
    if (termsAccept) {
      dispatch(register({...formData.data, ...data})).then(() => isLoggedIn());
    } else {
      Alert.alert('Please read and accept our Terms & Conditions');
    }
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
            <Text
              style={[
                styles.placeholder,
                {
                  marginBottom: isKeyboardOpen || deviceHeight <= 630 ? 6 : 12,
                },
              ]}>
              Password
            </Text>
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
              <Text style={styles.errorText}>{errors.password.message}</Text>
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
                  marginBottom: isKeyboardOpen || deviceHeight <= 630 ? 6 : 12,
                },
              ]}>
              Confirm Password
            </Text>
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

          {
            <View
              style={[
                styles.terms_and_conditions_container,
                {
                  marginTop: deviceHeight <= 630 ? 16 : 28,
                },
              ]}>
              <Checkbox
                onPress={() => setTermsAccept(prev => !prev)}
                value={termsAccept}
              />

              <View style={styles.terms_and_conditions_sub_container}>
                <Text style={styles.privacy_policy_text}>
                  I agree to amotaudio’s{' '}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://staging-aa.kinsta.cloud/support/privacy-policy/',
                    )
                  }>
                  <Text style={styles.terms_and_conditions_text}>
                    terms and conditions
                  </Text>
                </TouchableOpacity>
                <View style={styles.privacy_policy_container}>
                  <Text style={styles.privacy_policy_text}> and </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        'https://staging-aa.kinsta.cloud/support/privacy-policy/',
                      )
                    }>
                    <Text style={styles.terms_and_conditions_text}>
                      privacy policy.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }

          <View
            style={[
              styles.submit_container,
              {
                marginTop: isKeyboardOpen ? 24 : 38,
              },
            ]}>
            <Button
              name={'Register'}
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              disabled={!isConnected}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SecondStep;

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
    width: '88%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  terms_and_conditions_sub_container: {
    flexWrap: 'wrap',
    width: '90%',
    flexDirection: 'row',
  },
  terms_and_conditions_text: {
    color: COLORS.SECONDARY,
    fontFamily: FONTS.BOLD,
  },
  privacy_policy_container: {
    flexDirection: 'row',
    fontFamily: FONTS.BOLD,
  },
  privacy_policy_text: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
  },
  error_container: {
    marginTop: 11,
  },
});
