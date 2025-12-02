import React, { useCallback, useEffect, useRef } from 'react';
import {
  Image,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TextInputSelectionChangeEvent,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';
import { Text } from 'react-native';
import { generateImages } from '@core/imageGenerator';
import { addCard } from '@core/ankiDroidApi';
import { getSettings, Settings } from '@core/settings';
import Setting from '@components/Setting';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';
import ButtonInput from '@components/buttons/ButtonInput';

// TODO: доделать сохранение карт в анки
// TODO: переместить кнопку cloze на клавиатуру
const CardEditorScreen = ({ navigation, route }: CardEditorScreenProps) => {
  const selectedArray = route.params.selectedSet;
  const countSet = selectedArray.length;
  const flatListRef = useRef<FlatList<string> | null>(null);

  const [data, setData] = React.useState(route.params.posData);
  const [settings, setSettings] = React.useState<Settings | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = React.useState(selectedArray[0]);
  const [ImagePaths, setImagePaths] = React.useState<{
    [key: number]: string[];
  }>({});
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [currentSelection, setCurrentSelection] = React.useState<Selection>();

  const { width: screenWidth } = useWindowDimensions();
  const IMAGE_WIDTH = 250;
  const IMAGE_MARGIN = 5;
  const ITEM_WIDTH = IMAGE_WIDTH + IMAGE_MARGIN * 2;

  const handleCreateCard = useCallback(
    (index: number) => {
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
    [navigation, selectedArray, countSet],
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
      let originalText = String();

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

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      setSettings(settings);
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.imageGenerationMode === 'no image') return;
    if (Object.keys(ImagePaths).length > 0) return;

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
  }, [navigation, route, selectedArray, ImagePaths, settings]);

  const renderItem = ({ item }: { item: string }) =>
    item === '' ? (
      <Text style={styles.noImage}>No image</Text>
    ) : (
      <Image source={{ uri: `file://${item}` }} style={styles.image} />
    );

  return (
    <View style={styles.main}>
      <ScrollView style={styles.second}>
        <Setting setting="deckName" settingName="Deck name" options={Options.deckNames} />
        {settings?.imageGenerationMode !== 'no image' && (
          <View style={styles.imageContainer}>
            {ImagePaths[currentIndex] ? (
              <FlatList
                ref={flatListRef}
                data={ImagePaths[currentIndex]}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToOffsets={getSnapToOffsets(ImagePaths[currentIndex].length)}
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
          onChange={e =>
            setData(prev => {
              const newData = prev;
              newData[currentIndex].definitionCloze = e.nativeEvent.text;
              return newData;
            })
          }
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
            onChange={e =>
              setData(prev => {
                const newData = prev;
                newData[currentIndex].examplesCloze[index] = e.nativeEvent.text;
                return newData;
              })
            }
          />
        ))}
      </ScrollView>
      <ButtonInput title="cloze selected word" fontsize={16} height={30} width={180} onPress={handleClozeSelected} />
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
    flex: 1,
    alignItems: 'center',
    paddingBottom: 34,
    backgroundColor: Colors.default.main,
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
