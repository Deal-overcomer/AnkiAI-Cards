import ApiSetting from '@components/ApiSetting';
import Setting from '@components/Setting';
import { TColors } from '@constants/Colors';
import * as Options from '@constants/Options';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRefreshColors } from '@utils/useColors';
import useStyles from '@utils/useStyles';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RootStackParamList } from '../App';

const SettingsScreen = ({ route }: SettingsScreenProps) => {
	const { styles } = useStyles(styling);

	const refreshColors = useRefreshColors();

	return (
		<View style={styles.view}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
				<Setting setting="deckName" settingName="Deck name" options={Options.deckNames} />
				<Setting setting="language" settingName="Language" options={Options.languages} />
				<Setting setting="levelOfLanguage" settingName="Language level" options={Options.englishLevels} />
				<Setting setting="fontColor" settingName="Font color" options={Options.fontColors} createOption={false} onChange={refreshColors} />
				<Setting setting="model" settingName="AI model" options={Options.models} />

				<ApiSetting firstInit={route.params.firstInit} />
			</ScrollView>
		</View>
	);
}

const styling = (colors: TColors) => StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: colors.default.main
	},
	contentContainer: {
		paddingBottom: '100%',
		paddingTop: 12,
		gap: 12
	}
});

export type SettingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

type SettingScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
	navigation: SettingScreenNavigationProp;
	route: SettingScreenRouteProp;
}

export default SettingsScreen;
