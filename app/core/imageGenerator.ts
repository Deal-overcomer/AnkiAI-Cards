import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { getApiKey, getSettings } from '@core/settings';
import RNFS from 'react-native-fs';
import { CardEditorScreenNavProp } from '@screens/CardEditorScreen';
import ImageResizer from 'react-native-image-resizer';

const openai = new OpenAI({ apiKey: 'dsadas' });

export const generateImages = async ({ word, definition, pos, navigation }: generateImagesProps) => {
	const imagePaths: string[] = [];
	const settings = await getSettings();
	const width = Number(settings.imageResolution.match(/^\d*/));
	const height = Number(settings.imageResolution.match(/\d*$/));

	if (settings.imageGenerationMode === 'no image') {
		console.log('Image generation is disabled in settings.');
		return [];
	}

	const prompt = `Create a visual illustration that represents the concept: ${word} but without any labels!

  STRICT REQUIREMENTS:
  - NO TEXT of any kind in the image
  - NO WORDS written anywhere
  - NO LETTERS or symbols
  - PURELY VISUAL representation only
  - Show the concept through objects, actions, or scenes
  
  - Part of speech: ${pos}
  
  This is for visual memory association. The image must be completely text-free
  and show only visual elements that represent the meaning: ${definition}
  
  Style: clean, simple, no text overlays, no captions, no labels.`;

	try {
		const apiKey = await getApiKey();
		const genAI = new GoogleGenAI({ apiKey: apiKey as string });

		const response = await genAI.models.generateImages({
			model: settings.imageGenerationMode,
			prompt,
			config: {
				numberOfImages: Number(settings.countOfImages),
				aspectRatio: '4:3',
			},
		});

		if (response.generatedImages && response.generatedImages.length > 0) {
			for (let image in response.generatedImages) {
				const generatedImage = response.generatedImages[image];
				if (generatedImage.image?.imageBytes) {
					const fileName = `temp_${word}_${Date.now()}.png`;
					const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
					await RNFS.writeFile(filePath, generatedImage.image.imageBytes, 'base64');

					const resizedImage = await resizeImage(filePath, width, height);
					imagePaths.push(resizedImage.path);
					await RNFS.unlink(filePath);
				} else {
					throw new Error('generateImage error: invalid response');
				}
			}
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

	return imagePaths;
};

const resizeImage = async (imagePath: string, width: number, height: number) => {
	const quality = 90;

	return await ImageResizer.createResizedImage(
		imagePath,
		width,
		height,
		'PNG',
		quality,
		0, // rotation
		undefined, // outputPath
		false, // keepMeta
		{
			mode: 'stretch',
			onlyScaleDown: false,
		},
	);
};

export const cleanupTempImages = async (imagePaths: string[], navigation: CardEditorScreenNavProp): Promise<void> => {
	try {
		for (const path of imagePaths) {
			const exists = await RNFS.exists(path);
			if (exists) {
				await RNFS.unlink(path);
			}
		}

		console.log('Temporary images cleaned up successfully.');
	} catch (error) {
		console.error('Error cleaning up temp images:', error);
		navigation.navigate('Error', {
			error: {
				name: 'Cleanup temp Error',
				message: error instanceof Error ? error.message : String(error),
			},
		});
	}
};

interface generateImagesProps {
	word: string;
	pos: string;
	definition: string;
	navigation: CardEditorScreenNavProp;
}
