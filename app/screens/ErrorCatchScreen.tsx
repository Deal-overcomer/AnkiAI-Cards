import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Colors from '@constants/Colors';

import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ErrorCatchsreen = ({ route }: ErrorScreenNavigationProps) => {
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
    color: '#770000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
  },
  textMessage: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 22,
    color: '#3b1515',
  },
});

export type ErrorCatchProps = {
  error?: Error;
};

type ErrorScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Error'
>;

type ErrorScreenRootProp = RouteProp<RootStackParamList, 'Error'>;

interface ErrorScreenNavigationProps {
  navigation: ErrorScreenNavigationProp;
  route: ErrorScreenRootProp;
}

export default ErrorCatchsreen;
