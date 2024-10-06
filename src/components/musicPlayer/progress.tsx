/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
// ** React Imports
import {StyleSheet, Text, View} from 'react-native';

// ** Third Party Imports
import {useProgress} from 'react-native-track-player';

// ** Component Imports
import ProgressBar from './progressBar';
import React from 'react';


function TrackProgress({activePosition}) {
  const {position, duration} = useProgress(200);

  function format(seconds) {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 0, paddingBottom: 0
      }}>
      <View>
        <ProgressBar totalLength={duration} position={position} />
      </View>
      <View
        style={styles.trackTimeBox}>
        <Text style={styles.trackProgress}>{format(position)}</Text>
        <Text style={styles.trackProgress}>{format(duration)}</Text>
      </View>
    </View>
  );
}

export default TrackProgress;

const styles = StyleSheet.create({
  trackProgress: {
    padding: 6,
    marginTop: 8,
    fontSize: 11,
    color: 'white',
  },
  trackTimeBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    padding: -20,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
