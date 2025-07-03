import { ScrollView, StyleSheet, View } from 'react-native';
import Colors from '@constants/Colors';
import Setting from '@components/Setting';
import * as Option from '@constants/Options';

const SettingsScreen = () => {
  return (
    <View style={styles.view}>
      <ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
        <Setting
          setting="levelOfLanguage"
          settingName="English level"
          options={Option.englishLevels}
        />
        <Setting
          setting="model"
          settingName="Gemini AI model"
          options={Option.geminiModels}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.default.main,
  },
});

export default SettingsScreen;
