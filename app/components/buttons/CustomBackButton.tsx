import Colors from '@constants/Colors';
import useStyles from '@utils/useStyles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';


const CustomBackButton = React.memo(({ ...props }: TouchableOpacityProps) => {
  const { styles } = useStyles(styling)

  return (
    <TouchableOpacity {...props} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
      <Text style={styles.backButtonText}>{'<'}</Text>
    </TouchableOpacity>
  );
});

const styling = (colors: typeof Colors) => StyleSheet.create({
  backButtonText: {
    fontSize: 54,
    color: colors.default.activityIndicator,
  },
});

export default CustomBackButton;
