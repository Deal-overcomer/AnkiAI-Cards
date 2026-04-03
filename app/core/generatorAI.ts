import { GoogleGenAI } from '@google/genai';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';
import getContentAI from '@utils/getContentAI';
import parseSdkAndModel from '@utils/parseSdkAndModel';
import { OpenAI } from 'openai';
import { getApiKey, getSettings } from './settings';

export const generateContent = async ({ prompt, setIsLoading, navigation }: GenerateContentProps): Promise<void> => {
	setIsLoading(true);

	const apiKey = await getApiKey();
	const settings = await getSettings();
	const [sdkMode, modelName] = parseSdkAndModel(settings.model);
	const content = getContentAI(prompt, settings);

	try {
		let response = '';
		if (sdkMode === 'gemini') {
			response = await geminiGetResponse({ apiKey, content, model: modelName });
		} else if (sdkMode === 'openai') {
			response = await openAIGetResponse({ apiKey, content, model: modelName });
		} else if (sdkMode === 'openrouter') {
			response = (await openRouterGetResponse({ apiKey, content, model: modelName })) || '';
		}

		const data: ApiResponseProps = JSON.parse(response.replaceAll('```', '').replace('json', ''));
		navigation.navigate('Result', {
			word: data.word,
			posData: data.posData,
		});
	} catch (error) {
		console.error('Error generating content:', error);
		navigation.navigate('Error', {
			error: error instanceof Error ? error : new Error(String(error)),
		});
	} finally {
		setIsLoading(false);
	}
};

const geminiGetResponse = async ({ apiKey, content, model }: getResponse): Promise<string> => {
	const gemini = new GoogleGenAI({ apiKey: apiKey || '' });
	const response: any = await gemini.models.generateContent({
		model,
		contents: content,
	});

	return response.text;
};

const openAIGetResponse = async ({ apiKey, content, model }: getResponse): Promise<string> => {
	const openai = new OpenAI({ apiKey: apiKey || '' });
	const response = await openai.responses.create({ model, input: content });

	return response.output_text;
};

const openRouterGetResponse = async ({ apiKey, content, model }: getResponse): Promise<string | null> => {
	const openai = new OpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: apiKey || '' });
	const response = await openai.chat.completions.create({
		model,
		messages: [{ role: 'user', content }],
	});

	return response.choices[0].message.content;
};

export type ApiResponseProps = {
	word: string;
	posData: {
		partOfSpeech: string;
		definition: string;
		definitionCloze: string;
		examples: string[];
		examplesCloze: string[];
	}[];
};

interface GenerateContentProps {
	prompt: string;
	setIsLoading: (isLoading: boolean) => void;
	navigation: HomeScreenNavigationProp;
}

type getResponse = {
	apiKey: string | null;
	content: string;
	model: string;
};
