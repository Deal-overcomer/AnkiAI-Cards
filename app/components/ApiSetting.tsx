import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@constants/Colors';
import ModalTextInput from '@components/ModalTextInput';
import ButtonInput from './buttons/ButtonInput';
import { getApiKey, saveApiKey } from '@core/settings';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalViewMini from './ModalViewMini';

const ApiSetting = ({ firstInit }: SettingsProps) => {
  const [modalTextInputVisible, setModalTextInputVisible] =
    React.useState(firstInit);
  const [modalViewMiniVisible, setModalViewMiniVisible] = React.useState(false);

  const handleOnSubmit = React.useCallback(async (value: string) => {
    if (value) {
      await saveApiKey(value);
      setModalTextInputVisible(false);
    }
  }, []);

  const handleOnCopy = React.useCallback(async () => {
    const apiKey = await getApiKey();
    if (apiKey) {
      Clipboard.setString(apiKey);
      setModalViewMiniVisible(true);
    }
  }, []);

  return (
    <View style={styles.view}>
      <ModalViewMini
        text="Copied!"
        visible={modalViewMiniVisible}
        onRequestClose={() => setModalViewMiniVisible(false)}
      />
      <ModalTextInput
        visible={modalTextInputVisible}
        onRequestClose={() => setModalTextInputVisible(false)}
        onSubmit={handleOnSubmit}
        label="API Key"
        placeholder="Enter API Key"
      />
      <Text style={styles.textName}>API Key</Text>
      <View style={styles.viewButtons}>
        <ButtonInput
          width={150}
          title="add"
          onPress={() => setModalTextInputVisible(true)}
        />
        <ButtonInput width={150} title="copy" onPress={handleOnCopy} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.default.posBackround,
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textName: { fontSize: 20 },
});

export type SettingsProps = { firstInit: boolean };

export default ApiSetting;
