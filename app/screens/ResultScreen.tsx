import React, { useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { LinearTransition, Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import ButtonInput from '@components/buttons/ButtonInput';
import { RootStackParamList } from '../App';
import Monicon from '@monicon/native';
import Colors from '@constants/Colors';

const ResultScreen = ({ navigation, route }: ResultScreenProps) => {
	const [openIndex, setOpenIndex] = React.useState<Set<number>>(new Set());
	const [selectedSet, setSelectedSet] = React.useState<Set<number>>(new Set());
	const duration: number = 150;

	const toggleOpenIndex = useCallback((index: number) => {
		setOpenIndex(prev => {
			if (prev.has(index)) {
				const tempSet = new Set(prev);
				tempSet.delete(index);
				return tempSet;
			} else {
				return new Set(prev).add(index);
			}
		});
	}, []);

	const toggleSelectedList = useCallback((index: number) => {
		setSelectedSet(prev => {
			if (prev.has(index)) {
				const tempSet = new Set(prev);
				tempSet.delete(index);
				return tempSet;
			} else {
				return new Set(prev).add(index);
			}
		});
	}, []);

	const handleOpenCardEditor = useCallback(({ route, navigation }: ResultScreenProps) => {
		navigation.navigate('CardEditor', {
			word: route.params.word,
			posData: route.params.posData.filter((_, index) => selectedSet.has(index))
		});
	}, [selectedSet]);

	return (
		<View style={styles.main}>
			<ScrollView
				contentContainerStyle={{
					paddingBottom: '100%',
					alignItems: 'center',
				}}
			>
				{route.params.posData.map((value, index) => (
					<Animated.View
						layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(duration)}
						style={styles.viewPos}
						key={`${index}`}
					>
						{selectedSet.has(index) && (
							<View style={styles.icon}>
								<Monicon name="mdi:check-outline" size={30} />
							</View>
						)}
						<Pressable onPress={() => toggleSelectedList(index)}>
							<Text style={styles.textPos}>{value.partOfSpeech}</Text>
							<Text style={styles.textDefinition}>{value.definition}</Text>
						</Pressable>
						<Pressable onPress={() => toggleOpenIndex(index)}>
							<Animated.View
								layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(duration)}
								style={styles.viewExamples}
								key="examples"
							>
								{openIndex.has(index) ? (
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
				<ButtonInput
					disabled={selectedSet.size === 0}
					title="Add to flashcards"
					fontsize={36}
					width={360}
					height={60}
					onPress={() => handleOpenCardEditor({ navigation, route })}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: Colors.default.main,
	},
	viewPos: {
		width: '95%',
		marginTop: 20,
		backgroundColor: Colors.default.posBackround,
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
	icon: { position: 'absolute', right: 24, top: 4 },
});

type ResultSceenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

interface ResultScreenProps {
	navigation: ResultSceenNavigationProp;
	route: ResultScreenRouteProp;
}

export default ResultScreen;
