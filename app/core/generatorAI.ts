import { GoogleGenAI } from '@google/genai';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';
import { getApiKey, getSettings } from './settings';

export const generateContent = async ({
  prompt,
  setIsLoading,
  navigation,
}: GenerateContentProps): Promise<void> => {
  setIsLoading(true);

  const apiKey = await getApiKey();
  const gemini = new GoogleGenAI({ apiKey: apiKey as string });

  const settings = await getSettings();
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
    Reponse in ${settings.language} language, use only ${settings.levelOfLanguage} words. 
    Make many parts of speech, in order: nouns, verbs, adjectives, adverbs, conjunctions, 
    prepositions, interjections, pronouns, determiners, etc.
    Don't make double POS, make 'noun-soft_thing, noun-wild_animal, verb-lift_hands', etc.
    Make 3 examples.
`;

  try {
    const response: any = await gemini.models.generateContent({
      model: settings.model,
      contents: content,
    });

    const data: ApiResponseProps = JSON.parse(
      response.text.replaceAll('```', '').replace('json', ''),
    );

    navigation.navigate('Result', {
      word: data.word,
      posData: data.posData,
    });
  } catch (error: any) {
    navigation.navigate('Error', { error: error });
  } finally {
    setIsLoading(false);
  }
};

export type ApiResponseProps = {
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
