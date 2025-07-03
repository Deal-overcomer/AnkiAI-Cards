import React from 'react';
import { Text, Modal, ModalProps, View, StyleSheet } from 'react-native';
import ButtonInput from './buttons/ButtonInput';
import Colors from '@constants/Colors';

const ModalViewMini = React.memo(
  ({ text, visible, onRequestClose, ...rest }: ModalViewMiniProps) => {
    return (
      <Modal
        {...rest}
        visible={visible}
        onRequestClose={onRequestClose}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.view}>
            <Text style={styles.text}>{text}</Text>
            <ButtonInput
              title="Close"
              onPress={onRequestClose}
              color="#00000089"
            />
          </View>
        </View>
      </Modal>
    );
  },
);

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
    backgroundColor: Colors.default.modalView,
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: '#00000089',
    borderWidth: 2,
  },
  text: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
});

type ModalViewMiniProps = ModalProps & {
  text: string;
};

export default ModalViewMini;
