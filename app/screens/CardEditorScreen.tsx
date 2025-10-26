import React, { useCallback, useEffect } from 'react';
import {
  Image,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  TextInputSelectionChangeEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { RouteProp } from '@react-navigation/native';
import { Text } from 'react-native';
import { generateImages } from '@core/imageGenerator';
import { addCard } from '@core/ankiDroidApi';
import Setting from '@components/Setting';
import * as Options from '@constants/Options';
import Colors from '@constants/Colors';
import ButtonInput from '@components/buttons/ButtonInput';

// TODO: допилить логику и добавить горизонтальный список изображений. Inputы нельзя редактировать
const CardEditorScreen = ({ navigation, route }: CardEditorScreenProps) => {
  const selectedArray = route.params.selectedSet;
  const countSet = selectedArray.length;
  const [data, setData] = React.useState(route.params.posData);
  const [currentIndex, setCurrentIndex] = React.useState(selectedArray[0]);
  const [ImagePaths, SetImagePaths] = React.useState<{
    [key: number]: string[];
  }>({});
  //
  const [currentSelection, setCurrentSelection] = React.useState<Selection>();

  const handleToggleSet = useCallback(
    (index: number) => {
      const nextIndex = selectedArray.indexOf(index) + 1;
      if (nextIndex < countSet) {
        setCurrentIndex(selectedArray[nextIndex]);
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
      `${originalText.slice(
        0,
        selectionIndexes.start,
      )}{{c1::${originalText.slice(
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
        originalText =
          currentItem.examplesCloze[Number(selectedField.slice(-1))];
        const result = clozedText(originalText);
        currentItem.examplesCloze[Number(selectedField.slice(-1))] = result;
      }

      return newData;
    });
  }, [currentSelection, currentIndex]);

  useEffect(() => {
    const images = Object() as { [key: number]: string[] };
    const getImages = async () => {
      for (const index of selectedArray) {
        images[index] = await generateImages({
          navigation,
          word: route.params.word,
          definition: route.params.posData[index].definition,
          pos: route.params.posData[index].partOfSpeech,
        });
      }
      SetImagePaths(images);
    };
    getImages();
  }, [navigation, route, selectedArray]);

  return (
    <View style={styles.main}>
      <ScrollView style={styles.second}>
        <Setting
          setting="deckName"
          settingName="Deck name"
          options={Options.deckNames}
        />
        {/* <View style={{ marginVertical: 10 }}>
          {ImagePaths[currentIndex] ? (
            ImagePaths[currentIndex].map((imagePath, index) => (
              <Image
                key={index} 
                source={{
                  uri: `file://${imagePath}`,
                }}
                style={{ marginBottom: 10, height: 250 }}
                resizeMode="contain"
                onError={error => console.log('Image load error:', error)}
              />
            ))
          ) : (
            <Text>Loading images...</Text>
          )}
        </View> */}
        <Text style={styles.titleText}>
          {route.params.posData[currentIndex].partOfSpeech}
        </Text>
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
          />
        ))}
      </ScrollView>
      <ButtonInput
        title="cloze selected word"
        fontsize={16}
        height={30}
        width={180}
        onPress={handleClozeSelected}
      />
      <ButtonInput
        title="Create card"
        width={300}
        height={50}
        fontsize={20}
        onPress={() => handleToggleSet(currentIndex)}
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
});

type Selection = {
  selectedField: 'definition' | `example_${number}`;
  selectionIndexes: { start: number; end: number };
};

export type CardEditorScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'CardEditor'
>;

type CardEditorScreenRouteProp = RouteProp<RootStackParamList, 'CardEditor'>;

interface CardEditorScreenProps {
  navigation: CardEditorScreenNavProp;
  route: CardEditorScreenRouteProp;
}

export default CardEditorScreen;
