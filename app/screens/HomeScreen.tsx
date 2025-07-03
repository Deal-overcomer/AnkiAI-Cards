import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Colors from '@constants/Colors';
import ButtonInput from '@components/buttons/ButtonInput';
import { generateContent } from '@core/api';
import ModalViewMini from '@components/ModalViewMini';
import SettingButton from '@components/buttons/SettingButton';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalText, setModalText] = useState(false);
  const textInputRef = React.useRef<TextInput>(null);
  const textRef = React.useRef<string>(text);

  const handlePress = useCallback(async () => {
    if (textRef.current.trim() && !isLoading) {
      await generateContent({
        prompt: textRef.current.trim().toLowerCase(),
        setIsLoading: setIsLoading,
        navigation: navigation,
      });
    } else {
      setModalText(true);
    }
  }, [navigation, isLoading]);

  const handleModalTextClose = useCallback(() => {
    setModalText(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setText('');
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, []),
  );

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  return (
    <View style={styles.main}>
      <ModalViewMini
        text="Please enter a word to generate"
        visible={modalText}
        onRequestClose={handleModalTextClose}
      />
      <SettingButton
        disabled={isLoading}
        onPress={() => navigation.navigate('Settings')}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter your word"
        onChangeText={setText}
        onSubmitEditing={handlePress}
        ref={textInputRef}
        value={text}
        editable={!isLoading}
      />
      {isLoading && (
        <ActivityIndicator
          style={styles.activityIndicator}
          size="large"
          color={Colors.default.activityIndicator}
        />
      )}
      <ButtonInput
        title="GENERATE"
        disabled={isLoading}
        onPress={handlePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.default.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: Colors.default.textInput,
    width: 350,
    borderRadius: 100,
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default HomeScreen;
