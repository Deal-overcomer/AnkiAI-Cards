import React from 'react';
import { StyleSheet, View, Button, ButtonProps } from 'react-native';
import Colors from '@constants/Colors';

type ButtonInputProps = Partial<ButtonProps> & {
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
      <View style={styles.buttionView}>
        <Button {...rest} title={title} color={color} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  buttionView: {
    width: 200,
    marginTop: 20,
  },
});

export default ButtonInput;
