import React from 'react';
import { StyleSheet, Text, Pressable, PressableProps } from 'react-native';
import Colors from '@constants/Colors';

const ButtonInput = React.memo(
  ({ title = '', disabled, color, width = 200, height = 40, fontsize = 18, ...rest }: ButtonInputProps) => {

    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={({ pressed }) => [
          {
            backgroundColor: color || Colors.default.buttonInput,
            width: width as any,
            height: height as any,
          },
          styles.buttonView,
          disabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[{ fontSize: fontsize }, styles.buttonText, disabled && styles.textDisabled]}>{title}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontWeight: 500,
  },
  buttonPressed: { transform: [{ scale: 0.95 }], elevation: 5 },
  buttonDisabled: { backgroundColor: Colors.default.buttonDisabled },
  textDisabled: { color: Colors.default.textDisabled },
});

type ButtonInputProps = Partial<PressableProps> & {
  title?: string;
  disabled?: boolean;
  color?: string;
  width?: number | string;
  height?: number | string;
  fontsize?: number;
};

export default ButtonInput;
