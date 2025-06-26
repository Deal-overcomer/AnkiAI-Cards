import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '../constants/Colors';

const CustomBackButton = React.memo(({ ...props }: TouchableOpacityProps) => {
  // console.log('CustomBackButton rendered');

  return (
    <TouchableOpacity
      {...props}
      style={styles.backButton}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <Text style={styles.backButtonText}>{'<'}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  backButton: {
    // padding: 12,
    // marginLeft: -8,
  },
  backButtonText: {
    fontSize: 54,
    color: Colors.default.activityIndicator,
    // fontWeight: 'bold',
  },
});

export default CustomBackButton;
