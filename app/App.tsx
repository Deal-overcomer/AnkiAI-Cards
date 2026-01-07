import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import CustomBackButton from '@components/buttons/CustomBackButton';
import { SettingsProps } from '@components/ApiSetting';
import ErrorCatchScreen, { ErrorCatchProps } from '@screens/ErrorCatchScreen';
import HomeScreen from '@screens/HomeScreen';
import ResultScreen from '@screens/ResultScreen';
import SettingsScreen from '@screens/SettingsScreen';
import CardEditorScreen from '@screens/CardEditorScreen';
import { ApiResponseProps } from '@core/generatorAI';
import Colors from '@constants/Colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
	const BackButton = useCallback((navigation: NativeStackNavigationProp<any>) => {
		return <CustomBackButton onPress={() => navigation.goBack()} />;
	}, []);

	return (
		<KeyboardProvider statusBarTranslucent navigationBarTranslucent>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
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
					<Stack.Screen
						name="CardEditor"
						component={CardEditorScreen}
						options={({ navigation }) => ({
							title: 'Edit Card',
							headerStyle: { backgroundColor: Colors.default.main },
							headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
							headerTitleAlign: 'center',
							headerTintColor: '#000000',
							headerLeft: () => BackButton(navigation),
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</KeyboardProvider>
	);
};

export type RootStackParamList = {
	Home: undefined;
	Result: ApiResponseProps;
	Error: ErrorCatchProps;
	Settings: SettingsProps;
	CardEditor: ApiResponseProps & { selectedSet: Array<number> };
};

export default App;
