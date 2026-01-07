import { ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Setting from '@components/Setting';
import ApiSetting from '@components/ApiSetting';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';
import { RootStackParamList } from '../App';

const SettingsScreen = ({ route }: SettingsScreenProps) => {
	return (
		<View style={styles.view}>
			<ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
				<Setting setting="deckName" settingName="Deck name" options={Options.deckNames} />
				<Setting setting="language" settingName="Language" options={Options.languages} />
				<Setting setting="levelOfLanguage" settingName="Language level" options={Options.englishLevels} />
				<Setting setting="model" settingName="AI model" options={Options.models} />
				<Setting setting="imageGenerationMode" settingName="Image mode" options={Options.imageGenerationModes} />
				<Setting setting="countOfImages" settingName="Count of images" options={Options.countOfImages} />
				<Setting setting="imageResolution" settingName="Image resolution" options={Options.imageResolutions} />
				<ApiSetting firstInit={route.params.firstInit} />
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	view: { flex: 1, backgroundColor: Colors.default.main },
});

export type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

type SettingScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
	navigation: SettingScreenNavigationProp;
	route: SettingScreenRouteProp;
}

export default SettingsScreen;
