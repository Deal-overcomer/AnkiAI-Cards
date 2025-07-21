import React from 'react';
import { StyleSheet, Text, Pressable, PressableProps } from 'react-native';
import Colors from '@constants/Colors';

const ButtonInput = React.memo(
  ({ title = '', disabled, color, width = 200, ...rest }: ButtonInputProps) => {
    // console.log('ButtonInput rendered');

    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={({ pressed }) => [
          { backgroundColor: color || Colors.default.buttonInput },
          { width: width },
          styles.buttionView,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, disabled && styles.textDisabled]}>
          {title}
        </Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  buttionView: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: { backgroundColor: '#6e6e6e' },
  textDisabled: { color: '#919191' },
});

type ButtonInputProps = Partial<PressableProps> & {
  title?: string | undefined;
  disabled?: boolean | undefined;
  color?: string | undefined;
  width?: number | undefined;
};

export default ButtonInput;
