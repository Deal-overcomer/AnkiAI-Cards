import Colors from '@constants/Colors';
import { BlurView } from "@react-native-community/blur";
import useStyles from '@utils/useStyles';
import React, { useEffect, useState } from 'react';
import { Modal, ModalProps, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ButtonInput from './buttons/ButtonInput';


const ModalTextInput = React.memo(
	({ visible, onRequestClose, onSubmit, label, initialValue = '', placeholder = '', ...rest }: ModalTextInputProps) => {
		const [value, setValue] = useState(initialValue);

		const { styles, colors } = useStyles(styling)

		useEffect(() => {
			setValue(initialValue);
		}, [initialValue, visible]);

		return (
			<Modal {...rest} visible={visible} onRequestClose={onRequestClose} animationType="fade" transparent={true}>
				<Pressable style={styles.overlay} onPress={onRequestClose}>
					<Pressable style={styles.view} onPress={(e) => e.stopPropagation()} android_disableSound>
						<BlurView style={[StyleSheet.absoluteFill, { borderRadius: 30 }]} overlayColor={colors.modal.canvas} />
						{label ? <Text style={styles.text}>{label}</Text> : null}
						<TextInput
							style={styles.input}
							value={value}
							onChangeText={setValue}
							onSubmitEditing={() => onSubmit(value)}
							placeholder={placeholder}
							placeholderTextColor={colors.modal.placeholder}
							cursorColor={colors.modal.cursor}
							textAlign="center"
							autoFocus
						/>

						<View style={{ flexDirection: 'row', gap: 30, marginTop: 20 }}>
							<ButtonInput title="Cancel" onPress={onRequestClose} color={colors.modal.second} width={100} />
							<ButtonInput title="OK" onPress={() => onSubmit(value)} color={colors.modal.second} width={160} />
						</View>
					</Pressable>
				</Pressable>
			</Modal>
		);
	},
);

const styling = (colors: typeof Colors) => StyleSheet.create({
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
		borderRadius: 30,
		borderStyle: 'solid',
		borderColor: colors.modal.second,
		borderWidth: 2,
		padding: 10,
		overflow: 'hidden',
	},
	text: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: colors.root.text,
	},
	input: {
		color: colors.modal.text,
		width: '90%',
		height: 50,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: colors.modal.second,
		backgroundColor: colors.modal.input,
		fontSize: 18,
		paddingHorizontal: 12,
		marginBottom: 16,
	},
});

interface ModalTextInputProps extends ModalProps {
	visible: boolean;
	onRequestClose: () => void;
	onSubmit: (value: string) => void;
	label?: string;
	initialValue?: string;
	placeholder?: string;
};

export default ModalTextInput;
