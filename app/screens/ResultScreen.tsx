import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Colors from '@constants/Colors';
import Animated, {
  LinearTransition,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

const ResultScreen = ({ route }: ResultScreenProps) => {
  const [openIndex, setOpenIndex] = React.useState<number[]>([]);
  const duration: number = 150;

  const toggleOpenIndex = useCallback((idk: number) => {
    setOpenIndex(prev =>
      prev.includes(idk) ? prev.filter(item => item !== idk) : [...prev, idk],
    );
  }, []);

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
        {route.params.posData.map((value, index) => (
          <Animated.View
            layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(
              duration,
            )}
            style={styles.viewPos}
            key={`${index}`}
          >
            <Text style={styles.textPos}>{value.partOfSpeech}</Text>
            <Text style={styles.textDefinition}>{value.definition}</Text>
            <Pressable onPress={() => toggleOpenIndex(index)}>
              <Animated.View
                layout={LinearTransition.easing(
                  Easing.inOut(Easing.ease),
                ).duration(duration)}
                style={styles.viewExamples}
                key="examples"
              >
                {openIndex.includes(index) ? (
                  <>
                    {value.examples.map((value, index) => (
                      <Animated.Text
                        entering={FadeIn.duration(duration)}
                        exiting={FadeOut.duration(duration)}
                        key={index}
                        style={styles.textExample}
                      >
                        {value}
                      </Animated.Text>
                    ))}
                    <Animated.Text
                      entering={FadeIn.duration(duration)}
                      exiting={FadeOut.duration(duration)}
                      style={styles.textExample}
                    >
                      ▲
                    </Animated.Text>
                  </>
                ) : (
                  <Animated.Text
                    entering={FadeIn.duration(duration)}
                    exiting={FadeOut.duration(duration)}
                    style={styles.textExample}
                  >
                    show examples ▼
                  </Animated.Text>
                )}
              </Animated.View>
            </Pressable>
          </Animated.View>
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
    overflow: 'hidden',
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
