export const parseSdkAndModel = (mode: string) => {
	const [sdkMode, ...modelName] = mode.split('/');
	return [sdkMode, modelName.join('/')] as [SdkModeType, string];
};

type SdkModeType = 'gemini' | 'openai' | 'openrouter' | (string & {});
