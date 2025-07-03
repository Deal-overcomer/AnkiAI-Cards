import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ResultScreen from '@screens/ResultScreen';
import { ApiResponseProps } from '@core/api';
import Colors from '@constants/Colors';
import CustomBackButton from '@components/buttons/CustomBackButton';
import ErrorCatchScreen, { ErrorCatchProps } from '@screens/ErrorCatchScreen';
import SettingsScreen from '@screens/SettingsScreen';
import { InitSettings } from '@core/settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO: добавить выбор АПИ ключа.
// TODO: сделать экспорт для карточек анки, с генерацией изображения.
const App = () => {
  useEffect(() => {
    async () => {
      await InitSettings();
    };
  }, []);

  const BackButton = useCallback(
    (navigation: NativeStackNavigationProp<any>) => {
      return <CustomBackButton onPress={() => navigation.goBack()} />;
    },
    [],
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={({ route, navigation }) => ({
            headerStyle: { backgroundColor: Colors.default.main },
            headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
            title: route.params.word,
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerLeft: () => BackButton(navigation),
          })}
        />
        <Stack.Screen
          name="Error"
          component={ErrorCatchScreen}
          options={({ navigation }) => ({
            title: 'error',
            headerStyle: { backgroundColor: Colors.default.main },
            headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerLeft: () => BackButton(navigation),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }) => ({
            title: 'Settings',
            headerStyle: { backgroundColor: Colors.default.main },
            headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerLeft: () => BackButton(navigation),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type RootStackParamList = {
  Home: undefined;
  Result: ApiResponseProps;
  Error: ErrorCatchProps;
  Settings: undefined;
};

export default App;
