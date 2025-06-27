import { Text, Modal, ModalProps, View, StyleSheet } from 'react-native';
import ButtonInput from './ButtonInput';
import Colors from '@constants/Colors';

const ModalNoText = ({ visible, onRequestClose, ...rest }: ModalProps) => {
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
          <Text style={styles.text}>Please enter a word to generate.</Text>
          <ButtonInput
            title="Close"
            onPress={onRequestClose}
            color="#00000089"
          />
        </View>
      </View>
    </Modal>
  );
};

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

export default ModalNoText;
