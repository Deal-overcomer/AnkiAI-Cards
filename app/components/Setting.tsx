import ModalTextInput from '@components/ModalTextInput';
import Colors from '@constants/Colors';
import DefaultSetting from '@constants/DefaultSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import useStyles from '@utils/useStyles';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


const Setting = React.memo(({ setting, settingName, options, createOption = true, onChange = () => { } }: SettingProps) => {
	const [selectedValue, setSelectedValue] = React.useState('');
	const [createdOption, setCreatedOption] = React.useState('');
	const [isInitialized, setIsInitialized] = React.useState(false);
	const [modalTextInputVisible, setModalTextInputVisible] = React.useState(false);

	const prevSelectedValue = React.useRef(selectedValue);

	const { styles, colors } = useStyles(styling)

	const handleModalTextInputClose = useCallback(() => {
		setSelectedValue(prevSelectedValue.current);
		setModalTextInputVisible(false);
	}, []);

	const handleModalTextInputSubmit = useCallback((value: string) => {
		setCreatedOption(value);
		setSelectedValue(value);
		setModalTextInputVisible(false);
	}, []);

	useEffect(() => {
		const getSetting = async () => {
			const value = await AsyncStorage.getItem(setting);
			if (value) {
				setSelectedValue(value);
				if (!options.includes(value)) {
					setCreatedOption(value);
				}
			}
		};
		getSetting();
		setIsInitialized(true);
	}, [setting, options]);

	useEffect(() => {
		if (!isInitialized) return;
		if (selectedValue === 'create_option') {
			setModalTextInputVisible(true);
		} else {
			prevSelectedValue.current = selectedValue;
			const saveValue = async () => {
				await AsyncStorage.setItem(setting, selectedValue);
			};
			saveValue();
			onChange();
		}
	}, [setting, selectedValue, isInitialized, onChange]);

	return (
		<View style={styles.view}>
			<Text style={styles.textName}>{settingName}</Text>
			<View style={styles.settings}>
				<Picker selectedValue={selectedValue} mode="dropdown" dropdownIconColor={colors.root.text} onValueChange={value => setSelectedValue(value)} >
					{options.map(option => (
						<Picker.Item key={option} label={option} value={option} style={styles.textSetting} />
					))}
					{createdOption !== '' && (
						<Picker.Item key={createdOption} label={createdOption} value={createdOption} style={styles.textSetting} />
					)}
					{createOption
						&& <Picker.Item key="create_option" value="create_option" label="Create option..." style={styles.textSetting} />
					}
				</Picker>
			</View>

			<ModalTextInput
				visible={modalTextInputVisible}
				onRequestClose={handleModalTextInputClose}
				onSubmit={handleModalTextInputSubmit}
				placeholder="Enter a new option"
			/>
		</View>
	);
})

const styling = (colors: typeof Colors) => StyleSheet.create({
	view: {
		marginHorizontal: 16,
		marginTop: 12,
		backgroundColor: colors.default.posBackround,
		padding: 10,
		elevation: 10,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textName: { fontSize: 20, color: colors.root.text },
	textSetting: { fontSize: 18, color: colors.root.text, backgroundColor: colors.default.examplesBackround },
	settings: {
		backgroundColor: colors.default.examplesBackround,
		width: '55%',
		borderRadius: 10,
	},
});

type SettingProps = {
	setting: keyof typeof DefaultSetting;
	settingName: string;
	options: string[];
	createOption?: boolean;
	onChange?: () => void;
};

export default Setting;
