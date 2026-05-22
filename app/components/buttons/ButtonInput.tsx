import Colors from '@constants/Colors';
import useStyles from '@utils/useStyles';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text } from 'react-native';


const ButtonInput = React.memo(
  ({ title = '', disabled, color, width = '50%', height = 40, fontsize = 18, ...rest }: ButtonInputProps) => {
    const { styles, colors } = useStyles(styling)

    return (
      <Pressable
        {...rest}
        disabled={disabled}
        style={({ pressed }) => [
          rest.style as any,
          {
            backgroundColor: color || colors.default.buttonInput,
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

const styling = (colors: typeof Colors) => StyleSheet.create({
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontWeight: 500,
    color: colors.root.text,
  },
  buttonPressed: { transform: [{ scale: 0.95 }], elevation: 5 },
  buttonDisabled: { backgroundColor: colors.default.buttonDisabled },
  textDisabled: { color: colors.default.textDisabled },
});

interface ButtonInputProps extends Partial<PressableProps> {
  title?: string;
  disabled?: boolean;
  color?: string;
  width?: number | string;
  height?: number | string;
  fontsize?: number;
};

export default ButtonInput;
