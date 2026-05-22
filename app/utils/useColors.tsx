import Colors, { TColors, textColors } from '@constants/Colors';
import { getSettings, ISettings } from '@core/settings';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


interface IColorsContext {
	colors: TColors;
	refreshColors: () => void;
};

const ColorsContext = createContext<IColorsContext>({ colors: Colors, refreshColors: () => { } });

export const ColorsProvider = ({ children }: { children: React.ReactNode }) => {
	const [colors, setColors] = useState<TColors>(Colors);

	const loadColors = useCallback(() => {
		getSettings().then((settings: ISettings) => {
			setColors({
				...Colors,
				root: {
					...Colors.root,
					text: textColors[settings.fontColor],
				},
			});
		});
	}, []);

	useEffect(() => { loadColors(); }, [loadColors]);

	return (
		<ColorsContext.Provider value={{ colors, refreshColors: loadColors }}>
			{children}
		</ColorsContext.Provider>
	);
};

export const useRefreshColors = () => useContext(ColorsContext).refreshColors;

export default () => useContext(ColorsContext).colors;
