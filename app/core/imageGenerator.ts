import { GoogleGenAI } from '@google/genai';
import { OpenAI } from 'openai';
import { getApiKey, getSettings } from '@core/settings';
import RNFS from 'react-native-fs';
import { CardEditorScreenNavProp } from '@screens/CardEditorScreen';
import ImageResizer from 'react-native-image-resizer';
import { parseImageMode } from '@utils/parseImageMode';

export const generateImages = async ({ word, definition, pos, navigation }: generateImagesProps) => {
	const imagePaths: string[] = [];
	const settings = await getSettings();
	const [sdkMode, modelName] = parseImageMode(settings.imageGenerationMode);
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

	const writeBase64ToFile = async (base64Data: string | undefined) => {
		if (base64Data) {
			const fileName = `temp_${word}_${crypto.randomUUID()}.png`;
			const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
			await RNFS.writeFile(filePath, base64Data, 'base64');

			const resizedImage = await resizeImage(filePath, width, height);
			imagePaths.push(resizedImage.path);
			await RNFS.unlink(filePath);
		} else {
			throw new Error('generateImage error: invalid response');
		}
	};

	const openAIGetImage = async ({ apiKey }: getResponse) => {
		const openai = new OpenAI({ apiKey: apiKey || '' });

		const response = await openai.images.generate({
			model: modelName,
			prompt,
			n: Number(settings.countOfImages),
			size: modelName.includes('dall') ? '1024x1024' : '1536x1024',
			response_format: 'b64_json',
		});

		if (response.data && response.data.length > 0) {
			for (const image of response.data) {
				await writeBase64ToFile(image?.b64_json);
			}
		}
	};

	const openRouterGetImage = async ({ apiKey }: getResponse) => {
		const openai = new OpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey: apiKey || '' });

		const response = await openai.chat.completions.create({
			model: modelName,
			messages: [
				{
					role: 'user',
					content: 'Generate a beautiful sunset over mountains',
				},
			],
			// @ts-ignore - OpenAI SDK doesn't have typings for images in chat completions yet
			modalities: ['image'],
			image_config: {
				aspect_ratio: '4:3',
			},
			n: Number(settings.countOfImages),
		});

		// @ts-ignore
		if (response.choices[0].message?.images) {
			// @ts-ignore
			for (const image of response.choices[0].message?.images) {
				await writeBase64ToFile(image.image_url.image);
			}
		}
	};

	const geminiGetImage = async ({ apiKey }: getResponse) => {
		const genAI = new GoogleGenAI({ apiKey: apiKey || '' });
		const response = await genAI.models.generateImages({
			model: modelName,
			prompt,
			config: {
				numberOfImages: Number(settings.countOfImages),
				aspectRatio: '4:3',
			},
		});

		if (response.generatedImages && response.generatedImages.length > 0) {
			for (let image in response.generatedImages) {
				const generatedImage = response.generatedImages[image];
				await writeBase64ToFile(generatedImage.image?.imageBytes);
			}
		}
	};

	try {
		const apiKey = await getApiKey();

		if (sdkMode === 'openai') await openAIGetImage({ apiKey });
		else if (sdkMode === 'gemini') await geminiGetImage({ apiKey });
		else if (sdkMode === 'openrouter') await openRouterGetImage({ apiKey });
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

type getResponse = {
	apiKey: string | null;
};

interface generateImagesProps {
	word: string;
	pos: string;
	definition: string;
	navigation: CardEditorScreenNavProp;
}
