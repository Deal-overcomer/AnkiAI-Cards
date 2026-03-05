import { ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Setting from '@components/Setting';
import ApiSetting from '@components/ApiSetting';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';

const SettingsScreen = ({ route }: SettingsScreenProps) => (
	<View style={styles.view}>
		<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: '100%' }}>
			<Setting setting="deckName" settingName="Deck name" options={Options.deckNames} />
			<Setting setting="language" settingName="Language" options={Options.languages} />
			<Setting setting="levelOfLanguage" settingName="Language level" options={Options.englishLevels} />
			<Setting setting="model" settingName="AI model" options={Options.models} />
			<ApiSetting firstInit={route.params.firstInit} />
		</ScrollView>
	</View>
);

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
