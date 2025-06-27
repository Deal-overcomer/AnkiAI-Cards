import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Colors from '@constants/Colors';

// TODO: add reanimated
const ResultScreen = ({ route }: ResultScreenProps) => {
  console.log('ResultScreen rendered');

  const [openIndex, setOpenIndex] = React.useState<number[]>([]);

  const toggleOpenIndex = useCallback((idk: number) => {
    setOpenIndex(prev =>
      prev.includes(idk) ? prev.filter(item => item !== idk) : [...prev, idk],
    );
  }, []);

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
        {route.params.posData.map((value, index) => (
          <View style={styles.viewPos} key={`${index}`}>
            <Text style={styles.textPos}>{value.partOfSpeech}</Text>
            <Text style={styles.textDefinition}>{value.definition}</Text>
            <Pressable onPress={() => toggleOpenIndex(index)}>
              {openIndex.includes(index) ? (
                <View style={styles.viewExamples} key="examples">
                  {value.examples.map((value, index) => (
                    <Text key={index} style={styles.textExample}>
                      {value}
                    </Text>
                  ))}
                  <Text style={styles.textExample}>▲</Text>
                </View>
              ) : (
                <View style={styles.viewExamples} key="examples">
                  <Text style={styles.textExample}>show examples ▼</Text>
                </View>
              )}
            </Pressable>
          </View>
        ))}
      </ScrollView>
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
  viewPos: {
    marginTop: 20,
    backgroundColor: Colors.default.posBackround,
    marginInline: 10,
    borderRadius: 40,
    padding: 5,
    elevation: 10,
  },
  viewExamples: {
    backgroundColor: Colors.default.examplesBackround,
    marginBottom: 10,
    borderRadius: 20,
    padding: 5,
  },
  textPos: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 700,
  },
  textDefinition: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#000000c1',
  },
  textExample: {
    textAlign: 'center',
    fontSize: 20,
  },
});

type ResultSceenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Result'
>;

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
  navigation: ResultSceenNavigationProp;
  route: ResultScreenRouteProp;
}

export default ResultScreen;
