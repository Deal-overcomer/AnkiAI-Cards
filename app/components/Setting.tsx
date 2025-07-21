import React, { useCallback, useEffect } from 'react';
import Colors from '@constants/Colors';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefauiltSetting from '@constants/DefaultSettings';
import ModalTextInput from '@components/ModalTextInput';

const Setting = ({ setting, settingName, options }: SettingProps) => {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [createdOption, setCreatedOption] = React.useState('');
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [modalTextInputVisible, setModalTextInputVisible] =
    React.useState(false);
  const prevSelectedValue = React.useRef(selectedValue);

  const handleModalTextInputClose = useCallback(() => {
    setSelectedValue(prevSelectedValue.current);
    setModalTextInputVisible(false);
  }, []);

  const handleModalTextInputSubmit = useCallback((value: string) => {
    setCreatedOption(value);
    setSelectedValue(value);
    setModalTextInputVisible(false);
  }, []);

  useEffect(() => {
    const getSetting = async () => {
      const value = await AsyncStorage.getItem(setting);
      if (value) {
        setSelectedValue(value);
        if (!options.includes(value)) {
          setCreatedOption(value);
        }
      }
    };
    getSetting();
    setIsInitialized(true);
  }, [setting, options]);

  useEffect(() => {
    if (!isInitialized) return;
    if (selectedValue === 'create_option') {
      setModalTextInputVisible(true);
    } else {
      prevSelectedValue.current = selectedValue;
      const saveValue = async () => {
        await AsyncStorage.setItem(setting, selectedValue);
      };
      saveValue();
    }
  }, [setting, selectedValue, isInitialized]);

  return (
    <View style={styles.view}>
      <ModalTextInput
        visible={modalTextInputVisible}
        onRequestClose={handleModalTextInputClose}
        onSubmit={handleModalTextInputSubmit}
        placeholder="Enter a new option"
      />
      <Text style={styles.textName}>{settingName}</Text>
      <View style={styles.settings}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={value => setSelectedValue(value)}
        >
          {options.map(option => (
            <Picker.Item
              key={option}
              label={option}
              value={option}
              style={styles.textSetting}
            />
          ))}
          {createdOption !== '' && (
            <Picker.Item
              key={createdOption}
              label={createdOption}
              value={createdOption}
              style={styles.textSetting}
            />
          )}
          <Picker.Item
            key="create_option"
            value="create_option"
            label="Create option..."
            style={styles.textSetting}
          />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginBottom: 12,
    backgroundColor: Colors.default.posBackround,
    padding: 10,
    marginHorizontal: 16,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  textName: {
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
    marginBottom: 10,
  },
  textSetting: { fontSize: 18, color: '#000' },
  settings: {
    backgroundColor: Colors.default.examplesBackround,
    width: '70%',
    borderRadius: 20,
  },
});

type SettingProps = {
  setting: keyof typeof DefauiltSetting;
  settingName: string;
  options: string[];
};

export default Setting;
