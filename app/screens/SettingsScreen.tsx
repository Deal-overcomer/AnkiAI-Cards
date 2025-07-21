import { ScrollView, StyleSheet, View } from 'react-native';
import Colors from '@constants/Colors';
import Setting from '@components/Setting';
import * as Option from '@constants/Options';
import ApiSetting from '@components/ApiSetting';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';

const SettingsScreen = ({ route }: SettingsScreenProps) => {
  return (
    <View style={styles.view}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: '100%', paddingTop: '30%' }}
      >
        <Setting
          setting="language"
          settingName="Language"
          options={Option.languages}
        />
        <Setting
          setting="levelOfLanguage"
          settingName="English level"
          options={Option.englishLevels}
        />
        <Setting
          setting="model"
          settingName="AI model"
          options={Option.geminiModels}
        />
        <ApiSetting firstInit={route.params.firstInit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    // padding: 16,
    backgroundColor: Colors.default.main,
  },
});

export type SettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type SettingScreenRouteProp = RouteProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingScreenNavigationProp;
  route: SettingScreenRouteProp;
}

export default SettingsScreen;
