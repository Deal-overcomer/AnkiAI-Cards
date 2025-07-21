import React, { useCallback } from 'react';
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
import { SettingsProps } from '@components/ApiSetting';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

// TODO: сделать экспорт для карточек анки, с генерацией изображения.
const App = () => {
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
            headerTransparent: true,
            headerBlurEffect: 'systemThinMaterialDark',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
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
            headerTransparent: true,
            headerBlurEffect: 'systemThinMaterialDark',
            title: 'error',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerLeft: () => BackButton(navigation),
          })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }) => ({
            headerTransparent: true,
            headerBlurEffect: 'systemThinMaterialDark',
            title: 'Settings',
            // headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
            headerTitleAlign: 'center',
            headerTintColor: '#000000',
            headerLeft: () => BackButton(navigation),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: { backgroundColor: Colors.default.main },
  headerTitle: { fontSize: 36, fontWeight: 'bold' },
});

export type RootStackParamList = {
  Home: undefined;
  Result: ApiResponseProps;
  Error: ErrorCatchProps;
  Settings: SettingsProps;
};

export default App;
