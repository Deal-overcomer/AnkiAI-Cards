import React from 'react';
import { Text, Modal, ModalProps, View, StyleSheet, Pressable } from 'react-native';
import ButtonInput from './buttons/ButtonInput';
import Colors from '@constants/Colors';

const ModalViewMini = React.memo(({ text, visible, onRequestClose, ...rest }: ModalViewMiniProps) => {
  return (
    <Modal {...rest} visible={visible} onRequestClose={onRequestClose} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <View style={styles.view}>
          <Text style={styles.text}>{text}</Text>
          <ButtonInput title="Close" onPress={onRequestClose} color={Colors.modal.second} />
        </View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    height: 200,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.modal.canvas,
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: Colors.modal.second,
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
});

type ModalViewMiniProps = ModalProps & {
  text: string;
};

export default ModalViewMini;
