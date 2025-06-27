import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ButtonProps,
  Text,
  Pressable,
  PressableProps,
} from 'react-native';
import Colors from '@constants/Colors';

type ButtonInputProps = Partial<PressableProps> & {
  color?: string;
  title?: string;
};

const ButtonInput = React.memo(
  ({
    color = Colors.default.buttonInput,
    title = '',
    ...rest
  }: ButtonInputProps) => {
    // console.log('ButtonInput rendered');

    return (
      <Pressable
        {...rest}
        style={[styles.buttionView, { backgroundColor: color }]}
      >
        <Text style={styles.buttonText}>{title}</Text>
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
});

export default ButtonInput;
