import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@screens/HomeScreen';
import ResultScreen from '@screens/ResultScreen';
import { ApiResponse } from '@core/api';
import Colors from '@constants/Colors';
import CustomBackButton from '@components/CustomBackButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
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
            headerTintColor: '#000',
            headerLeft: () => (
              <CustomBackButton onPress={() => navigation.goBack()} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export type RootStackParamList = {
  Home: undefined;
  Result: ApiResponse;
};

export default App;
