import { API_KEY, model } from '../constants/API';
import { GoogleGenAI } from '@google/genai';
import { HomeScreenNavigationProp } from '../screens/HomeScreen';
import { language, levelOfLanguage } from '../constants/Language';

const gemini = new GoogleGenAI({ apiKey: API_KEY });

export const generateContent = async ({
  prompt,
  setIsLoading,
  navigation,
}: GenerateContentProps): Promise<void> => {
  setIsLoading(true);

  const content = `
    Generate me a JSON object for the word "${prompt}".
    The JSON should follow this interface:
    {
      word: string;
      posData: [
        {
          partOfSpeech: string;
          definition: string;
          examples: string[];
        },
      ];
    };
    
    Return ONLY the JSON object.
    Reponse in ${language} language, use only ${levelOfLanguage} words.
    Make many parts of speech, in order: nouns, verbs, adjectives, adverbs, conjunctions, 
    prepositions, interjections, pronouns, determiners, etc.
    Don't make double POS, make 'noun 1st, noun 2nd, noun 3rd', etc.
`;

  try {
    const response: any = await gemini.models.generateContent({
      model: model,
      contents: content,
    });

    const data: ApiResponse = JSON.parse(
      response.text.replaceAll('```', '').replace('json', ''),
    );

    navigation.navigate('Result', {
      word: data.word,
      posData: data.posData,
    });
  } catch (error) {
    console.error('API Error:', error);
  } finally {
    setIsLoading(false);
  }
};

export type ApiResponse = {
  word: string;
  posData: [
    {
      partOfSpeech: string;
      definition: string;
      examples: string[];
    },
  ];
};

interface GenerateContentProps {
  prompt: string;
  setIsLoading: (isLoading: boolean) => void;
  navigation: HomeScreenNavigationProp;
}
