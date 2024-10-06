import {useContext, useEffect, useState} from 'react';
import {Track, useActiveTrack} from 'react-native-track-player';
import { AuthContext } from '../../context/AuthContext';


export const useLastActiveTrack = () => {
  const {lastActiveTrack, setLastActiveTrack} = useContext(AuthContext)

  const activeTrack = useActiveTrack();
  // const [lastActiveTrack, setLastActiveTrack] = useState<Track>();


  useEffect(() => {
    if (!activeTrack) return;

    setLastActiveTrack(activeTrack);
  }, [activeTrack]);

  return lastActiveTrack;
};
