import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  Text,
  Linking,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Button} from '../custom';
import {COLORS, FONTS} from '../../constants';

const cancel = require('../../../assets/image/cancel.png');

const PurchaseMembership = ({showPopUp, hidePop}: any) => {
  return (
    <Modal transparent visible={showPopUp}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalBody}>
          <Text style={styles.modalText1}>
            Become a member of The Listening Room
          </Text>

          <Text style={styles.modalText2}>
            Become a member of the listening room streaming audio and be at a
            meeting anytime, anywhere! You will have access to thousands of AA
            and Al-Anon speakers anytime you want and as many times as you want.
            Pay monthly or for a whole year with unlimited access to everything
            on the website. This is a fabulous addition to any program of
            recovery.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              name={'Proceed'}
              onPress={() => {
                Linking.openURL('https://amotaudio.com/product/membership/');
                hidePop();
              }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.crossBtn} onPress={() => hidePop()}>
          <Image source={cancel} style={{width: '100%', height: '100%'}} />

          <Text style={styles.cancelModalText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 24,
    borderWidth: 1,
    borderColor: '#CADB29',
    backgroundColor: 'black',
    width: '90%',
    borderRadius: 10,
  },
  modalText1: {
    color: COLORS.TEXT,
    fontFamily: FONTS.REGULAR,
    fontSize: 20,
    width: '80%',
    lineHeight: 28,
  },
  modalText2: {
    color: '#C0C0C0',
    fontFamily: FONTS.REGULAR,
    fontSize: 18,
    lineHeight: 25,
    marginTop: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 38,
    marginBottom: 6,
  },
  crossBtn: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 56,
    alignItems: 'center',
  },
  noTracksText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: '30%',
  },
  cancelModalText: {
    color: 'white',
    fontFamily: FONTS.REGULAR,
    fontSize: 16,
    marginTop: 10,
  },
});

export default PurchaseMembership;
