/* eslint-disable prettier/prettier */
// ** React Imports
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';

// ** Constant Imports
import {COLORS, FONTS} from '../../../constants';
// ** Third Party Imports
import Icon from 'react-native-vector-icons/Ionicons';

const termsAndConditions = [
  {
    title: 'Acceptance of Terms',
    description:
      'By using Amot Audio, you agree to comply with and be bound by these terms and conditions. If you do not agree with any of these terms, please do not use our services.',
  },
  {
    title: 'Age Restriction',
    description:
      'You must be at least 18 years old to use Amot Audio. By using our services, you affirm that you are of legal age to enter into this agreement.',
  },
  {
    title: 'Purpose',
    description:
      'Amot Audio is intended solely for individuals, friends, and family dealing with Alcohol addiction, as an aid to give understanding, recovery and hope.',
  },
  {
    title: 'Content',
    description:
      'The content provided by Amot Audio includes audio tracks, playlists, and related materials. This content is for informational and inspirational purposes only and should not be considered a substitute for professional medical advice, diagnosis, or treatment.',
  },
  {
    title: 'User Conduct',
    description:
      'You agree to use Amot Audio in accordance with all applicable laws and regulations. You must not use the app for any unlawful or unauthorized purpose, or in any way that violates the rights of others.',
  },
  {
    title: 'Privacy',
    description:
      'We respect your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy for details on how we collect, use, and disclose your data.',
  },
  {
    title: 'Intellectual Property',
    description:
      'All content and materials provided by Amot Audio, including but not limited to audio tracks, logos, and trademarks, are the property of Amot Audio or its licensors. You may not reproduce, distribute, or modify any content without prior written permission.',
  },
  {
    title: 'Disclaimer of Warranties',
    description:
      "Amot Audio is provided on an 'as is' and 'as available' basis, without any warranties of any kind, express or implied. We do not guarantee that the app will be uninterrupted, error-free, or free from viruses or other harmful components.",
  },
  {
    title: 'Limitation of Liability',
    description:
      'In no event shall Amot Audio or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the app, including but not limited to loss of data, loss of profits, or loss of goodwill.',
  },
  {
    title: 'Changes to Terms',
    description:
      'We reserve the right to modify or update these terms and conditions at any time without prior notice. It is your responsibility to review this page periodically for changes.',
  },
  {
    title: 'Governing Law',
    description:
      'These terms and conditions shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.',
  },
];

const Terms = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.main_container}>
      <View style={styles.main_container}>
        <View style={styles.headerBox}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backBtnStyle}>
            <Icon name="arrow-back" size={25} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.header}>Terms and Conditions</Text>
        </View>

        <ScrollView style={{marginTop: 24}}>
          <Text style={styles.text}>
            Welcome to AMOT Audio's premier audio application designed to
            enhance your recovery journey.
          </Text>

          {termsAndConditions.map((terms, i) => (
            <Text key={i} style={styles.textHeader}>
              {i + 1}. {terms.title}:{' '}
              <Text style={styles.textDescription}>{terms.description}</Text>
            </Text>
          ))}

          <Text style={styles.text}>
            By using Amot Audio, you acknowledge that you have read, understood,
            and agree to be bound by these terms and conditions. If you have any
            questions or concerns, please contact us at terms@amotaudio.com.
            Thank you for choosing Amot Audio to support your recovery journey.
          </Text>

          <View style={{margin: 84}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Terms;

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
  text: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 18,
    lineHeight: 25,
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
  textHeader: {
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    fontSize: 15,
    lineHeight: 25,
    marginTop: 8,
    marginBottom: 8,
  },
  textDescription: {
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT,
    fontSize: 15,
    lineHeight: 25,
  },
});
