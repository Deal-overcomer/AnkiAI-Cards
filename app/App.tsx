import { SettingsProps } from '@components/ApiSetting';
import CustomBackButton from '@components/buttons/CustomBackButton';
import { ApiResponseProps } from '@core/generatorAI';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import CardEditorScreen from '@screens/CardEditorScreen';
import ErrorCatchScreen, { ErrorCatchProps } from '@screens/ErrorCatchScreen';
import HomeScreen from '@screens/HomeScreen';
import ResultScreen from '@screens/ResultScreen';
import SettingsScreen from '@screens/SettingsScreen';
import useColors, { ColorsProvider } from '@utils/useColors';
import { useCallback } from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-url-polyfill/auto';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => (
	<ColorsProvider>
		<KeyboardProvider statusBarTranslucent navigationBarTranslucent>
			<AppContent />
		</KeyboardProvider>
	</ColorsProvider>
);

const AppContent = () => {
	const colors = useColors()

	const BackButton = useCallback((navigation: NativeStackNavigationProp<RootStackParamList>) => {
		return <CustomBackButton onPress={() => navigation.goBack()} />
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
				<Stack.Screen
					name="Result"
					component={ResultScreen}
					options={({ route, navigation }) => ({
						headerStyle: { backgroundColor: colors.default.main },
						headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
						title: route.params.word,
						headerTitleAlign: 'center',
						headerTintColor: colors.root.text,
						headerLeft: () => BackButton(navigation),
					})}
				/>
				<Stack.Screen
					name="Error"
					component={ErrorCatchScreen}
					options={({ navigation }) => ({
						title: 'error',
						headerStyle: { backgroundColor: colors.default.main },
						headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
						headerTitleAlign: 'center',
						headerTintColor: colors.root.text,
						headerLeft: () => BackButton(navigation),
					})}
				/>
				<Stack.Screen
					name="Settings"
					component={SettingsScreen}
					options={({ navigation }) => ({
						title: 'Settings',
						headerStyle: { backgroundColor: colors.default.main },
						headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
						headerTitleAlign: 'center',
						headerTintColor: colors.root.text,
						headerLeft: () => BackButton(navigation),
					})}
				/>
				<Stack.Screen
					name="CardEditor"
					component={CardEditorScreen}
					options={({ navigation }) => ({
						title: 'Edit Card',
						headerStyle: { backgroundColor: colors.default.main },
						headerTitleStyle: { fontSize: 54, fontWeight: 'bold' },
						headerTitleAlign: 'center',
						headerTintColor: colors.root.text,
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
	Settings: SettingsProps;
	CardEditor: ApiResponseProps;
};

export default App;
