import { GoogleGenAI, Modality } from '@google/genai';
import { getApiKey, getSettings } from './settings';
import { HomeScreenNavigationProp } from '@screens/HomeScreen';

const generateImage = async (
  name: string,
  navigation: HomeScreenNavigationProp,
): Promise<void> => {
  const settings = await getSettings();
  const prompt = `Create ${settings.countOfImages} different images of word "${name}" in a 3d rendered style.
  Use only ${settings.imageResolution} resolution.`;

  try {
    const apiKey = await getApiKey();
    const genAI = new GoogleGenAI({ apiKey: apiKey as string });

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (
      response.candidates &&
      response.candidates[0].content &&
      Array.isArray(response.candidates[0].content.parts)
    ) {
      for (const part of response.candidates[0].content.parts) {
        const imageData = part.inlineData?.data;
        // TODO: save imageData to storage
      }
    } else {
      throw new Error('generateImage error: invalid response format');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    navigation.navigate('Error', {
      error: {
        name: 'Image Generation Error',
        message: error instanceof Error ? error.message : String(error),
      },
    });
  }
};
