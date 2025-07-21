import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
} from 'react-native';
import Colors from '@constants/Colors';

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
    // marginLeft: -8,
    // marginBottom: 10
  },
  backButtonText: {
    fontSize: 48,
    color: Colors.default.activityIndicator,
    lineHeight: 42,
    // fontWeight: 'bold',
  },
});

export default CustomBackButton;
