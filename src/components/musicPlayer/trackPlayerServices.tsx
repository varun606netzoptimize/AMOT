// ** Third Party Imports
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from 'react-native-track-player';
import NetInfo from '@react-native-community/netinfo';

let isConnected = false;

function updatePlayerCapabilities() {
  const capabilities = [Capability.Play, Capability.Pause, Capability.SeekTo];

  if (isConnected) {
    capabilities.push(Capability.SkipToNext, Capability.SkipToPrevious);
  }

  TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    capabilities: capabilities,
    compactCapabilities: [Capability.Play, Capability.Pause],
    progressUpdateEventInterval: 2,
  });
}

// Subscribe to internet connection status updates
NetInfo.addEventListener(state => {
  isConnected = state.isConnected && state.isInternetReachable;
  updatePlayerCapabilities();
});

console.log('isConnected  idhar yaar:', isConnected);

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 10,
    });
    updatePlayerCapabilities();
    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addTracks(tracks) {
  await TrackPlayer.reset();
  await TrackPlayer.add(tracks);
  await TrackPlayer.play();
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    if (isConnected) {
      console.log('Event.RemoteNext');
      await TrackPlayer.skipToNext();
      TrackPlayer.play();
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    if (isConnected) {
      console.log('Event.RemotePrevious');
      await TrackPlayer.skipToPrevious();
      TrackPlayer.play();
    }
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async event => {
    console.log('Event.RemoteSeek', event.position);
    await TrackPlayer.seekTo(event.position);
  });
}
