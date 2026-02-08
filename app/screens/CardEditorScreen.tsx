import React, { useCallback, useEffect, useRef } from 'react';
import {
	Image,
	Text,
	View,
	TextInput,
	StyleSheet,
	FlatList,
	useWindowDimensions,
	ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import ButtonInput from '@components/buttons/ButtonInput';
import Setting from '@components/Setting';
import { cleanupTempImages, generateImages } from '@core/imageGenerator';
import { addCard, uploadMedia } from '@core/ankiDroidApi';
import { getSettings, Settings } from '@core/settings';
import { RootStackParamList } from '../App';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';

const CardEditorScreen = ({ navigation, route }: CardEditorScreenProps) => {
	const selectedArray = route.params.selectedSet;
	const countSet = selectedArray.length;
	const flatListRef = useRef<FlatList<string> | null>(null);
	const imagePathsRef = useRef({} as { [key: number]: string[] });

	const [data, setData] = React.useState(route.params.posData);
	const [settings, setSettings] = React.useState<Settings | undefined>(undefined);
	const [currentIndex, setCurrentIndex] = React.useState(selectedArray[0]);
	const [imagePaths, setImagePaths] = React.useState<{ [key: number]: string[] }>({});
	const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
	const [currentSelection, setCurrentSelection] = React.useState<Selection>();

	const { width: screenWidth } = useWindowDimensions();
	const IMAGE_WIDTH = 250;
	const IMAGE_MARGIN = 5;
	const ITEM_WIDTH = IMAGE_WIDTH + IMAGE_MARGIN * 2;

	const handleCreateCard = useCallback(
		async (index: number) => {
			let img = '';
			if (settings?.imageGenerationMode !== 'no image' && selectedImageIndex) {
				img = await uploadMedia({
					mediaUrl: 'fdsfdsfds', // TODO:	Fix this bug
					fileName: `image_${route.params.word}_${crypto.randomUUID()}.jpg`,
					navigation,
				});
			}

			await addCard(settings?.deckName || 'Default', {
				keyword: route.params.word,
				img,
				definition: [data[index].partOfSpeech, data[index].definitionCloze],
				examples: data[index].examplesCloze,
			});

			const nextIndex = selectedArray.indexOf(index) + 1;
			if (nextIndex < countSet) {
				setCurrentIndex(selectedArray[nextIndex]);
				setSelectedImageIndex(0);
				flatListRef.current?.scrollToOffset({
					offset: 0,
					animated: true,
				});
			} else {
				navigation.navigate('Home');
			}
		},
		[navigation, selectedArray, selectedImageIndex, countSet, settings, data, route.params.word],
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
			const newData: typeof prev = [...prev];
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

	const getSnapToOffsets = useCallback(
		(numItems: number) => {
			return Array.from({ length: numItems }, (_, i) => i * ITEM_WIDTH);
		},
		[ITEM_WIDTH],
	);

	const onScrollEnd = useCallback(
		(event: any) => {
			const offsetX = event.nativeEvent.contentOffset.x;
			const index = Math.round(offsetX / ITEM_WIDTH);
			setSelectedImageIndex(index);
		},
		[ITEM_WIDTH],
	);

	// This sh... works kinda okay
	const syncSettings = useCallback(async () => {
		const fetchSettings = async () => {
			const settings = await getSettings();
			setSettings(settings);
		};

		await fetchSettings();
	}, []);

	useEffect(() => {
		imagePathsRef.current = imagePaths;
	}, [imagePaths]);

	useEffect(() => {
		return () => {
			cleanupTempImages(Object.values(imagePathsRef.current).flat(), navigation);
		};
	}, [navigation]);

	useEffect(() => {
		if (settings?.imageGenerationMode === 'no image') return;
		if (Object.keys(imagePaths).length > 0) return;

		console.log('Generating images...');
		const images = Object() as Record<number, string[]>;

		const getImages = async () => {
			for (const index of selectedArray) {
				images[index] = await generateImages({
					navigation,
					word: route.params.word,
					definition: route.params.posData[index].definition,
					pos: route.params.posData[index].partOfSpeech,
				});
				images[index].unshift('');
			}
			setImagePaths(images);
		};

		getImages();
	}, [imagePaths]);

	const renderItem = ({ item }: { item: string }) =>
		item === '' ? (
			<Text style={styles.noImage}>No image</Text>
		) : (
			<Image source={{ uri: `file://${item}` }} style={styles.image} />
		);

	return (
		<View style={styles.main}>
			<KeyboardAwareScrollView style={styles.second}>
				<Setting setting="deckName" settingName="Deck name" options={Options.deckNames} onChange={syncSettings} />
				{settings && settings?.imageGenerationMode !== 'no image' && (
					<View style={styles.imageContainer}>
						{imagePaths[currentIndex] ? (
							<FlatList
								ref={flatListRef}
								data={imagePaths[currentIndex]}
								renderItem={renderItem}
								horizontal
								showsHorizontalScrollIndicator={false}
								snapToOffsets={getSnapToOffsets(imagePaths[currentIndex].length)}
								decelerationRate="fast"
								snapToAlignment="center"
								onMomentumScrollEnd={onScrollEnd}
								contentContainerStyle={{
									paddingHorizontal: (screenWidth - ITEM_WIDTH) / 2,
								}}
							/>
						) : (
							<>
								<ActivityIndicator style={styles.loadingImages} size="large" color={Colors.default.activityIndicator} />
							</>
						)}
					</View>
				)}
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
							const newData = prev;
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
								const newData = prev;
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
	},
	imageContainer: {
		marginVertical: 10,
	},
	image: {
		width: 250,
		height: 200,
		margin: 5,
	},
	noImage: {
		width: 250,
		height: 200,
		margin: 5,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 18,
	},
	loadingImages: {
		height: 200,
		margin: 5,
	},
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
