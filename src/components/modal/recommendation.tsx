// ** React Imports
import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const RecommendationModal = ({
  visible,
  onClose,
  buttonText,
  headingText,
}: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeading}>{headingText}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeading: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    backgroundColor: '#1ed81e',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    width: 80,
  },
});

export default RecommendationModal;
