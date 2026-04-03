import { answerFmt1, css, questionFmt1 } from '@constants/ankiDroidApiC';
import AnkiDroid from '@deal-overcomer/react-native-ankidroid';

export const addCard = async (deckName: string, newCard: ankiDroidCard) => {
	await AnkiDroid.requestPermission();

	const modelName = 'English  Img+cloze+native_word';
	const dbDeckReference = 'com.anki.ai.decks';
	const dbModelReference = 'com.anki.ai.models';
	const modelFields = ['Keyword', 'IMG', 'Definition', 'Example'];
	const cardNames = ['Cloze 1'];

	const questionFormat = [questionFmt1];

	const answerFormat = [answerFmt1];

	const deckProperties = {
		name: deckName,
		dbReference: dbDeckReference,
	};
	const modelProperties = {
		name: modelName,
		dbReference: dbModelReference,
		fields: modelFields,
		cardNames,
		questionFormat,
		answerFormat,
		css,
	};

	const fieldOrder: (keyof ankiDroidCard)[] = ['keyword', 'img', 'definition', 'examples'];

	const valueFields = fieldOrder.map(field => {
		const value = newCard[field];
		return Array.isArray(value) ? value.join('<br>') : value;
	});

	const settings = {
		modelId: undefined,
		modelProperties: modelProperties,
		deckId: undefined,
		deckProperties: deckProperties,
	};

	const myAnkiDeck = new AnkiDroid(settings);

	await myAnkiDeck.addNote(valueFields, modelFields);
};

export type ankiDroidCard = {
	keyword: string;
	img: string;
	definition: string[];
	examples: string[];
};
