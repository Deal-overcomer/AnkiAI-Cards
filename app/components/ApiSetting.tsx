import ModalTextInput from '@components/ModalTextInput';
import Colors from '@constants/Colors';
import { getApiKey, saveApiKey } from '@core/settings';
import Clipboard from '@react-native-clipboard/clipboard';
import useStyles from '@utils/useStyles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ButtonInput from './buttons/ButtonInput';
import ModalViewMini from './ModalViewMini';


const ApiSetting = React.memo(({ firstInit }: SettingsProps) => {
	const [modalTextInputVisible, setModalTextInputVisible] = React.useState(firstInit);
	const [modalViewMiniVisible, setModalViewMiniVisible] = React.useState(false);

	const { styles } = useStyles(styling)

	const handleOnSubmit = React.useCallback(async (value: string) => {
		if (value) {
			await saveApiKey(value);
			setModalTextInputVisible(false);
		}
	}, []);

	const handleOnCopy = React.useCallback(async () => {
		const apiKey = await getApiKey();
		if (apiKey) {
			Clipboard.setString(apiKey);
			setModalViewMiniVisible(true);
		}
	}, []);

	return (
		<View style={styles.view}>
			<Text style={styles.textName}>API Key</Text>
			<View style={styles.viewButtons}>
				<ButtonInput width="40%" title="enter" onPress={() => setModalTextInputVisible(true)} />
				<ButtonInput width="40%" title="copy" onPress={handleOnCopy} />
			</View>

			<ModalViewMini
				text="Copied!"
				visible={modalViewMiniVisible}
				onRequestClose={() => setModalViewMiniVisible(false)}
			/>
			<ModalTextInput
				visible={modalTextInputVisible}
				onRequestClose={() => setModalTextInputVisible(false)}
				onSubmit={handleOnSubmit}
				label="API Key"
				placeholder="Enter API Key"
			/>
		</View>
	);
})

const styling = (colors: typeof Colors) => StyleSheet.create({
	view: {
		marginTop: 12,
		marginHorizontal: 16,
		backgroundColor: colors.default.posBackround,
		padding: 10,
		paddingBottom: 20,
		elevation: 10,
		borderRadius: 10,
		alignItems: 'center',
	},
	viewButtons: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	textName: { fontSize: 20, color: colors.root.text },
});

export type SettingsProps = { firstInit: boolean };

export default ApiSetting;
