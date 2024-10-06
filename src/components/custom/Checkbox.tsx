//  ** React Imports
import React from 'react';

// ** Third Party Imports
import {CheckBox} from '@rneui/themed';

// ** Constant Imports
import {COLORS} from '../../constants';

// ** Types
type CheckboxComponentProps = {
  value: any;
  onPress: () => void;
};

const Checkbox: React.FunctionComponent<CheckboxComponentProps> = ({
  value,
  onPress,
}) => {
  return (
    <CheckBox
      checked={value}
      onPress={onPress}
      containerStyle={{
        backgroundColor: COLORS.BASE,
        margin: 0,
        padding: 0,
        marginLeft: -0.5,
      }}
    />
  );
};

export default Checkbox;
