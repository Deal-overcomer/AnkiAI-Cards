import { TColors } from '@constants/Colors';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useStyles from '@utils/useStyles';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';


const ErrorCatchScreen = ({ route }: ErrorScreenNavigationProps) => {
	const { styles } = useStyles(styling)

	return (
		<View style={styles.view}>
			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: '100%' }}>
				<Text style={styles.textName}>{route.params.error?.name}</Text>
				<Text style={styles.textMessage}>{route.params.error?.message}</Text>
			</ScrollView>
		</View>
	);
};

const styling = (colors: TColors) => StyleSheet.create({
	view: {
		flex: 1,
		padding: 16,
		backgroundColor: colors.default.posBackround,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textName: {
		color: colors.root.errorTitle,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 26,
	},
	textMessage: {
		marginTop: 16,
		textAlign: 'center',
		fontSize: 22,
		color: colors.root.errorMessage,
	},
});

export interface ErrorCatchProps {
	error?: Error;
};

type ErrorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Error'>;

type ErrorScreenRootProp = RouteProp<RootStackParamList, 'Error'>;

interface ErrorScreenNavigationProps {
	navigation: ErrorScreenNavigationProp;
	route: ErrorScreenRootProp;
}

export default ErrorCatchScreen;
