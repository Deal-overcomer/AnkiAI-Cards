import React from 'react';
import { StyleSheet, Text, Pressable, PressableProps } from 'react-native';
import Colors from '@constants/Colors';

type ButtonInputProps = Partial<PressableProps> & {
  title?: string | undefined;
  disabled?: boolean | undefined;
  color?: string | undefined;
};

const ButtonInput = React.memo(
  ({ title = '', disabled, color, ...rest }: ButtonInputProps) => {
    // console.log('ButtonInput rendered');

    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={({ pressed }) => [
          { backgroundColor: color || Colors.default.buttonInput },
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
    width: 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 500,
  },
  buttonPressed: { transform: [{ scale: 0.95 }], elevation: 15, opacity: 0.8 },
  buttonDisabled: { backgroundColor: '#444444' },
  textDisabled: { color: '#6e6e6e' },
});

export default ButtonInput;
