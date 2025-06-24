import React, { useCallback, useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import Colors from '../constants/Colors';
import ButtonInput from '../components/ButtonInput';
import { generateContent } from '../core/api';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = React.useRef<TextInput>(null);

  const handlePress = useCallback(async () => {
    if (text.trim() && !isLoading) {
      await generateContent({
        prompt: text.trim().toLowerCase(),
        setIsLoading: setIsLoading,
        navigation: navigation,
      });
    } else {
      console.warn('Please enter a word'); // TODO: It's working bad and I don't know why
    }
  }, [navigation, text, isLoading]);

  useFocusEffect(
    useCallback(() => {
      setText('');
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }, []),
  );

  return (
    <View style={styles.main}>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your word"
        onChangeText={setText}
        onEndEditing={handlePress}
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
      <ButtonInput disabled={isLoading} onPress={handlePress} />
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
