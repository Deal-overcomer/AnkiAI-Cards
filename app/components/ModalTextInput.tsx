import React, { useState, useEffect } from 'react';
import { Text, Modal, ModalProps, View, StyleSheet, TextInput, KeyboardAvoidingView, Pressable } from 'react-native';
import ButtonInput from './buttons/ButtonInput';
import Colors from '@constants/Colors';

const ModalTextInput = React.memo(
	({ visible, onRequestClose, onSubmit, label, initialValue = '', placeholder = '', ...rest }: ModalTextInputProps) => {
		const [value, setValue] = useState(initialValue);

		useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		return (
			<Modal {...rest} visible={visible} onRequestClose={onRequestClose} animationType="fade" transparent={true}>
				<Pressable style={styles.overlay} onPress={onRequestClose}>
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
							textAlign="center"
						/>

						<View style={{ flexDirection: 'row', gap: 30 }}>
							<ButtonInput title="Cancel" onPress={onRequestClose} color={Colors.modal.second} width={100} />
							<ButtonInput title="OK" onPress={() => onSubmit(value)} color={Colors.modal.second} width={160} />
						</View>
					</View>
				</Pressable>
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
		backgroundColor: Colors.modal.canvas,
		borderRadius: 30,
		borderStyle: 'solid',
		borderColor: Colors.modal.second,
		borderWidth: 2,
		padding: 10,
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	input: {
		width: '90%',
		height: 50,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.modal.second,
		backgroundColor: Colors.modal.input,
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
