/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
// ** React Imports
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';

// ** Third Party Imports
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import TrackPlayer, {useIsPlaying} from 'react-native-track-player';

// ** Constant Imports
import {COLORS} from '../../constants';
import React, {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext';

type PlayerControlsProps = {
  style?: ViewStyle;
};

type PlayerButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export const PlayerControls = ({style}: PlayerControlsProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <SkipToPreviousButton />

        {/* <PlayPauseButton /> */}

        <SkipToNextButton />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({style, iconSize = 48}: PlayerButtonProps) => {
  const {setIsPaused, isConnected, currentPlaylistDetails} = useContext(AuthContext);

  const {playing} = useIsPlaying();

  return (
    <View style={[{height: iconSize}, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (playing) {
            TrackPlayer.pause();
            setIsPaused(true);
          } else {
            TrackPlayer.play();
            setIsPaused(false);
          }
        }}
        >
        <IconAntDesign
          name={playing ? 'pause' : 'play'}
          size={iconSize}
          color={COLORS.PRIMARY}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SkipToNextButton = ({iconSize = 30}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => TrackPlayer.skipToNext()}>
      <IconAntDesign name="forward" size={iconSize} color={COLORS.TEXT} />
    </TouchableOpacity>
  );
};

export const SkipToPreviousButton = ({iconSize = 30}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => TrackPlayer.skipToPrevious()}>
      <IconAntDesign name={'backward'} size={iconSize} color={COLORS.TEXT} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
