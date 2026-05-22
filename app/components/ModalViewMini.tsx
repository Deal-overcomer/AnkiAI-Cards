import Colors from '@constants/Colors';
import { BlurView } from '@react-native-community/blur';
import useStyles from '@utils/useStyles';
import React from 'react';
import { Modal, ModalProps, Pressable, StyleSheet, Text } from 'react-native';
import ButtonInput from './buttons/ButtonInput';


const ModalViewMini = React.memo(({ text, visible, onRequestClose, ...rest }: ModalViewMiniProps) => {
  const { styles, colors } = useStyles(styling)

  return (
    <Modal {...rest} visible={visible} onRequestClose={onRequestClose} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} onPress={onRequestClose}>
        <Pressable style={styles.view} onPress={(e) => e.stopPropagation()} android_disableSound>
          <BlurView style={[StyleSheet.absoluteFill, { borderRadius: 30 }]} overlayColor={colors.modal.canvas} />
          <Text style={styles.text}>{text}</Text>
          <ButtonInput title="Close" onPress={onRequestClose} color={colors.modal.second} style={styles.buttonInput} />
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styling = (colors: typeof Colors) => StyleSheet.create({
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
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: colors.modal.second,
    borderWidth: 2,
    overflow: 'hidden',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
    color: colors.root.text,
  },
  buttonInput: {
    marginTop: 20,
  },
});

interface ModalViewMiniProps extends ModalProps {
  text: string;
};

export default ModalViewMini;
