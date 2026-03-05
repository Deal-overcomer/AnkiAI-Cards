import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Colors from '@constants/Colors';

const ErrorCatchScreen = ({ route }: ErrorScreenNavigationProps) => {
	return (
		<View style={styles.view}>
			<ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
				<Text style={styles.textName}>{route.params.error?.name}</Text>
				<Text style={styles.textMessage}>{route.params.error?.message}</Text>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		padding: 16,
		backgroundColor: Colors.default.posBackround,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textName: {
		color: Colors.root.errorTitle,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 26,
	},
	textMessage: {
		marginTop: 16,
		textAlign: 'center',
		fontSize: 22,
		color: Colors.root.errorMessage,
	},
});

export type ErrorCatchProps = {
	error?: Error;
};

type ErrorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Error'>;

type ErrorScreenRootProp = RouteProp<RootStackParamList, 'Error'>;

interface ErrorScreenNavigationProps {
	navigation: ErrorScreenNavigationProp;
	route: ErrorScreenRootProp;
}

export default ErrorCatchScreen;
