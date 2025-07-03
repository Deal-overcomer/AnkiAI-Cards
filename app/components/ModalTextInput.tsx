import React, { useState, useEffect } from 'react';
import {
  Text,
  Modal,
  ModalProps,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import ButtonInput from './buttons/ButtonInput';
import Colors from '@constants/Colors';

const ModalTextInput = React.memo(
  ({
    visible,
    onRequestClose,
    onSubmit,
    label,
    initialValue = '',
    placeholder = '',
    ...rest
  }: ModalTextInputProps) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue, visible]);

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
            {label ? <Text style={styles.text}>{label}</Text> : null}
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              onSubmitEditing={() => onSubmit(value)}
              placeholder={placeholder}
              placeholderTextColor="#888"
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 30 }}>
              <ButtonInput
                title="Cancel"
                onPress={onRequestClose}
                color="#00000089"
                width={100}
              />
              <ButtonInput
                title="OK"
                onPress={() => onSubmit(value)}
                color="#00000089"
                width={160}
              />
            </View>
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
    height: 220,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.default.modalView,
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: '#00000089',
    borderWidth: 2,
    padding: 10,
  },
  text: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    width: '90%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 18,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
});

type ModalTextInputProps = ModalProps & {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (value: string) => void;
  label?: string;
  initialValue?: string;
  placeholder?: string;
};

export default ModalTextInput;
