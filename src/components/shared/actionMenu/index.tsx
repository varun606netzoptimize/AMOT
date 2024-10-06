/* eslint-disable prettier/prettier */
// ** React Imports
import React, {useRef} from 'react';
import {TouchableOpacity, View} from 'react-native';

// ** Third Party Imports
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// ** Component Imports
import BottomSheet from '../bottomSheet';

const ActionMenu = ({trackData, isRemoving, setIsRemoving}: any) => {
  const bottomSheetRef = useRef(0); // Create a ref for the BottomSheet component

  return (
    <>
      <TouchableOpacity
        onPress={() => bottomSheetRef.current.open()}
        activeOpacity={0.5}
        style={{height: 24,
          justifyContent: 'space-between',
          width: '9%',
          alignItems: 'center',}}>
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'white',
            borderRadius: 100,
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'white',
            borderRadius: 100,
          }}
        />
        <View
          style={{
            width: 4,
            height: 4,
            backgroundColor: 'white',
            borderRadius: 100,
          }}
        />
      </TouchableOpacity>
      <BottomSheet
        trackData={trackData}
        ref={bottomSheetRef}
        isRemoving={isRemoving}
        setIsRemoving={setIsRemoving}
      />
    </>
  );
};

export default ActionMenu;
