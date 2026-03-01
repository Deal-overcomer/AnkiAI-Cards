import React from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import Colors from '@constants/Colors';

const CustomBackButton = React.memo(({ ...props }: TouchableOpacityProps) => {

  return (
    <TouchableOpacity {...props} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
      <Text style={styles.backButtonText}>{'<'}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  backButtonText: {
    fontSize: 54,
    color: Colors.default.activityIndicator,
  },
});

export default CustomBackButton;
