import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultSettings from '@constants/DefaultSettings';
import * as Keychain from 'react-native-keychain';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';

export const initApiKey = async ({ navigation }: initApiKey) => {
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

export const getSettings = async (): Promise<Settings> => {
  const entries = await AsyncStorage.multiGet(Object.keys(defaultSettings));
  return Object.fromEntries(entries) as Record<keyof Settings, string>;
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

export interface Settings {
  language: string;
  levelOfLanguage: string;
  model: string;
  countOfImages: string;
  imageResolution: string;
  settingsInitialized: string;
}

interface initApiKey {
  navigation: HomeScreenNavigationProp;
}
