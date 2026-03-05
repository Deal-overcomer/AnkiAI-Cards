import React, { useCallback } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import ButtonInput from '@components/buttons/ButtonInput';
import Setting from '@components/Setting';
import { RootStackParamList } from '../App';
import { addCard } from '@core/ankiDroidApi';
import { getSettings } from '@core/settings';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';


const CardEditorScreen = ({ navigation, route }: CardEditorScreenProps) => {
	const deckNameRef = React.useRef<string | undefined>(undefined);

	const [data, setData] = React.useState(route.params.posData);
	const [currentIndex, setCurrentIndex] = React.useState(0);
	const [currentSelection, setCurrentSelection] = React.useState<Selection>();

	const handleCreateCard = useCallback(
		async (index: number) => {
			await addCard(deckNameRef.current || 'Default', {
				keyword: route.params.word,
				img: '',
				definition: [data[index].partOfSpeech, data[index].definitionCloze],
				examples: data[index].examplesCloze,
			});

			const nextIndex = currentIndex + 1;
			if (nextIndex < data.length) {
				setCurrentIndex(nextIndex);
			} else {
				navigation.navigate('Home');
			}
		},
		[data, currentIndex, route.params.word, navigation],
	);

	const handleSelection = useCallback((selection: Selection) => {
		setCurrentSelection(selection);
	}, []);

	const handleClozeSelected = useCallback(() => {
		if (currentSelection === undefined) return;

		const clozedText = (originalText: string) =>
			`${originalText.slice(0, selectionIndexes.start)}{{c1::${originalText.slice(
				selectionIndexes.start,
				selectionIndexes.end,
			)}}}${originalText.slice(selectionIndexes.end)}`;

		const { selectedField, selectionIndexes } = currentSelection;

		setData(prev => {
			const newData = [...prev];
			const currentItem = newData[currentIndex];
			let originalText = '';

			if (selectedField === 'definition') {
				originalText = currentItem.definitionCloze;
				const result = clozedText(originalText);
				currentItem.definitionCloze = result;
			} else {
				const idx = Number(selectedField.slice(-1));
				originalText = currentItem.examplesCloze[idx];
				const result = clozedText(originalText);
				currentItem.examplesCloze[idx] = result;
			}

			return newData;
		});
	}, [currentSelection, currentIndex]);


	const syncSettings = useCallback(async () => {
		const fetchSettings = async () => {
			const settings = await getSettings();
			deckNameRef.current = settings.deckName;
		};
		await fetchSettings();
	}, []);

	return (
		<View style={styles.main}>
			<KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={styles.second}>
				<Setting setting="deckName" settingName="Deck name" options={Options.deckNames} onChange={syncSettings} />
				<Text style={styles.titleText}>{route.params.posData[currentIndex].partOfSpeech}</Text>
				<TextInput
					onSelectionChange={event =>
						handleSelection({
							selectedField: 'definition',
							selectionIndexes: event.nativeEvent.selection,
						})
					}
					textAlign="center"
					multiline
					style={styles.editableText}
					value={data[currentIndex].definitionCloze}
					onChange={e => {
						const text = e.nativeEvent.text;

						setData(prev => {
							const newData = [...prev];
							newData[currentIndex].definitionCloze = text;
							return newData;
						});
					}}
				/>
				<Text style={styles.titleText}>examples</Text>
				{data[currentIndex].examplesCloze.map((examples, index) => (
					<TextInput
						onSelectionChange={event =>
							handleSelection({
								selectedField: `example_${index}`,
								selectionIndexes: event.nativeEvent.selection,
							})
						}
						textAlign="center"
						multiline
						key={index}
						style={styles.editableText}
						value={examples}
						onChange={e => {
							const text = e.nativeEvent.text;

							setData(prev => {
								const newData = [...prev];
								newData[currentIndex].examplesCloze[index] = text;
								return newData;
							});
						}}
					/>
				))}
			</KeyboardAwareScrollView>

			<KeyboardStickyView offset={{ closed: 0, opened: 100 }}>
				<ButtonInput title="cloze selected word" fontsize={16} height={30} width={180} onPress={handleClozeSelected} />
			</KeyboardStickyView>

			<ButtonInput
				title="Create card"
				width={300}
				height={50}
				fontsize={20}
				onPress={() => handleCreateCard(currentIndex)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	main: {
		alignItems: 'center',
		backgroundColor: Colors.default.main,
		flex: 1,
		paddingBottom: 34,
	},
	second: {
		width: '100%',
		backgroundColor: Colors.default.main,
	},
	titleText: {
		fontSize: 22,
		textAlign: 'center',
		marginTop: 10,
		fontWeight: '600',
	},
	editableText: {
		fontSize: 18,
		marginHorizontal: 16,
		marginVertical: 8,
		backgroundColor: Colors.default.examplesBackround,
		borderRadius: 10,
	}
});

type Selection = {
	selectedField: 'definition' | `example_${number}`;
	selectionIndexes: { start: number; end: number };
};

export type CardEditorScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'CardEditor'>;

type CardEditorScreenRouteProp = RouteProp<RootStackParamList, 'CardEditor'>;

interface CardEditorScreenProps {
	navigation: CardEditorScreenNavProp;
	route: CardEditorScreenRouteProp;
}

export default CardEditorScreen;
