import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultSettings from '@constants/DefaultSettings';

export const getSettings = async (): Promise<Settings> => {
  const entries = await AsyncStorage.multiGet([
    'language',
    'levelOfLanguage',
    'model',
  ]);
  return Object.fromEntries(entries) as Record<keyof Settings, string>;
};

export const InitSettings = async () => {
  const setting = await AsyncStorage.getItem(defaultSettings.model);
  if (!setting) {
    const entries = Object.entries(defaultSettings);
    await AsyncStorage.multiSet(entries); // BUG: not working defaultSettings
  }
};

export interface Settings {
  language: string;
  levelOfLanguage: string;
  model: string;
}
