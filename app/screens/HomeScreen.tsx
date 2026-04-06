import ButtonInput from '@components/buttons/ButtonInput';
import SettingButton from '@components/buttons/SettingButton';
import ModalViewMini from '@components/ModalViewMini';
import { ColorsI } from '@constants/Colors';
import { generateContent } from '@core/generatorAI';
import { getApiKey, initApiKey, InitSettings } from '@core/settings';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useStyles from '@utils/useStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';
import { RootStackParamList } from '../App';


const HomeScreen = ({ navigation }: HomeScreenProps) => {
	const [text, setText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modalText, setModalText] = useState(false);
	const [modalApi, setModalApi] = useState(false);

	const textInputRef = React.useRef<TextInput>(null);
	const textRef = React.useRef<string>(text);

	const { styles, colors } = useStyles(styling)

	const handlePress = useCallback(async () => {
		const apiKey = await getApiKey();
		const prompt = textRef.current.trim().toLocaleLowerCase()

		if (!apiKey) setModalApi(true);
		else if (prompt && !isLoading) await generateContent({ prompt, setIsLoading, navigation });
		else setModalText(true);
	}, [navigation, isLoading]);

	const handleCloseModals = useCallback(() => {
		setModalText(false);
		setModalApi(false);
	}, []);

	useFocusEffect(
		useCallback(() => {
			setText('');
			const timer = setTimeout(() => {
				textInputRef.current?.focus();
			}, 100);
			return () => clearTimeout(timer);
		}, []),
	);

	useEffect(() => {
		textRef.current = text;
	}, [text]);

	useEffect(() => {
		const init = async () => {
			await InitSettings();
			await initApiKey({ navigation });
		};

		init();
	}, [navigation]);

	return (
		<View style={styles.main}>
			<SettingButton disabled={isLoading} onPress={() => navigation.navigate('Settings', { firstInit: false })} />
			<TextInput
				ref={textInputRef}
				style={styles.textInput}
				placeholder="Enter your word"
				onChangeText={setText}
				onSubmitEditing={handlePress}
				value={text}
				editable={!isLoading}
				textAlign='center'
				cursorColor={colors.default.cursor}
				placeholderTextColor={colors.root.placeholder}
			/>
			<ButtonInput title="GENERATE" disabled={isLoading} onPress={handlePress} />

			{isLoading && <ActivityIndicator style={styles.activityIndicator} size="large" color={colors.default.activityIndicator} />}

			<ModalViewMini text="Please enter a word to generate" visible={modalText} onRequestClose={handleCloseModals} />
			<ModalViewMini text="Please enter your API key" visible={modalApi} onRequestClose={handleCloseModals} />
		</View>
	)
};

const styling = (colors: ColorsI) => StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: colors.default.main,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textInput: {
		color: colors.root.text,
		backgroundColor: colors.default.textInput,
		width: '80%',
		borderRadius: 100,
		fontSize: 20,
	},
	activityIndicator: {
		marginTop: 20,
	},
});

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
	navigation: HomeScreenNavigationProp;
}

export default HomeScreen;
