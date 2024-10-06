/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Slider from '@react-native-community/slider';

// ** Third Party Imports
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';

const ProgressBar = ({totalLength, position}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(position);
  }, [position]);

  return (
    <View style={styles.container}>
      <Slider
        thumbTintColor={'#56C5EC'}
        style={{width: '100%', height: 40}}
        value={progress}
        minimumValue={0}
        maximumValue={totalLength}
        minimumTrackTintColor="#56C5EC"
        maximumTrackTintColor="#5e5e5e"
        onValueChange={value => {
          TrackPlayer.seekTo(value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  bar: {
    height: 5,
    backgroundColor: '#333',
    borderRadius: 10,
  },
});

export default ProgressBar;
