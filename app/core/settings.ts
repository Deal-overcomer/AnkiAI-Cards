import defaultSettings from '@constants/DefaultSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';
import * as Keychain from 'react-native-keychain';

export const initApiKey = async ({ navigation }: IInitApiKey) => {
	const apiKey = await Keychain.getGenericPassword();
	if (!apiKey) {
		navigation.navigate('Settings', { firstInit: true });
	}
};

export async function saveApiKey(key: string) {
	await Keychain.setGenericPassword('api', key);
}

export async function getApiKey(): Promise<string | null> {
	const creds = await Keychain.getGenericPassword();
	return creds ? creds.password : null;
}

export const InitSettings = async () => {
	const setting = await AsyncStorage.getItem('settingsInitialized');

	if (!setting) {
		console.log('Settings not initialized, setting default values');
		const entries = Object.entries(defaultSettings);
		await AsyncStorage.multiSet(entries);
	}
};

export const getSettings = async (): Promise<ISettings> => {
	const entries = await AsyncStorage.multiGet(Object.keys(defaultSettings));
	return Object.fromEntries(entries) as Record<keyof ISettings, string> as ISettings;
};

const debugSettings = async () => {
	try {
		const allKeys = await AsyncStorage.getAllKeys();
		console.log('All AsyncStorage keys:', allKeys);

		const settings = await AsyncStorage.multiGet(Object.keys(defaultSettings));
		console.log('Current settings:', settings);
	} catch (error) {
		console.error('Debug error:', error);
	}
};
(global as any).debugSettings = debugSettings;

export type TFontColor = 'White' | 'Black' | 'Blue' | 'Pink';

export interface ISettings {
	deckName: string;
	language: string;
	levelOfLanguage: string;
	fontColor: TFontColor;
	model: string;
	settingsInitialized: string;
}

interface IInitApiKey {
	navigation: HomeScreenNavigationProp;
}
