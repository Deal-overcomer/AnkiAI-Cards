import { GoogleGenAI } from '@google/genai';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';
import { getApiKey, getSettings } from './settings';

export const generateContent = async ({ prompt, setIsLoading, navigation }: GenerateContentProps): Promise<void> => {
  setIsLoading(true);

  const apiKey = await getApiKey();
  const settings = await getSettings();
  const content = `
    Generate me a JSON object for the word "${prompt}".
    The JSON should follow this interface:
    {
      word: string;
      posData: [
        {
          partOfSpeech: string;1
          definition: string;
          definitionCloze: string;
          examples: string[];
          examplesCloze: string[];
        },
      ];
    };
    
    Return ONLY the JSON object.
    Reponse in ${settings.language} language, use only ${settings.levelOfLanguage} words. 
    Make many parts of speech, in order: nouns, verbs, adjectives, adverbs, conjunctions, 
    prepositions, interjections, pronouns, determiners, etc. You can use any tenses.
    Don't make double POS, make 'noun-soft_thing, noun-wild_animal, verb-lift_hands', etc.
    Make 3 examples.

    Make the definitionCloze and examplesCloze by removing the word from the definition and examples,
    replacing it with '{{c1::word}}' and pay attention to the correct form of the word,
    also you can just add {{c1::}} in the end if sentence doesn't have the word.
    For example: 
    {
      word: "run";
      posData: [
        {
          partOfSpeech: verb-move_fast;
          definition: "To move swiftly on foot.";
          definitionCloze: "To move swiftly on foot.{{c1::}}";
          examples: [
            "I like to run in the park.",d
            "She runs very fast.",
            "Why are you running away?"
          ];
          examplesCloze: [
            "I like to {{c1::run}} in the park.",
            "She {{c1::runs}} very fast.",
            "Why are you {{c1::running}} away?"
          ];
        },
      ];
    };
`;

  try {
    let response = await geminiGetResponse({
      apiKey,
      contents: content,
      model: settings.model,
    });
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

const geminiGetResponse = async ({ apiKey, contents, model }: getResponse): Promise<string> => {
  const gemini = new GoogleGenAI({ apiKey: apiKey as string });
  const response: any = await gemini.models.generateContent({
    model,
    contents,
  });

  return response.text;
};

export type ApiResponseProps = {
  word: string;
  posData: [
    {
      partOfSpeech: string;
      definition: string;
      definitionCloze: string;
      examples: string[];
      examplesCloze: string[];
    },
  ];
};

interface GenerateContentProps {
  prompt: string;
  setIsLoading: (isLoading: boolean) => void;
  navigation: HomeScreenNavigationProp;
}

type getResponse = {
  apiKey: string | null;
  contents: string;
  model: string;
};
