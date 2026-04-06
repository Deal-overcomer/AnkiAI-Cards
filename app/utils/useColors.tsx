import Colors, { ColorsI, textColors } from '@constants/Colors';
import { getSettings, Settings } from '@core/settings';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


type ColorsContextType = {
	colors: ColorsI;
	refreshColors: () => void;
};

const ColorsContext = createContext<ColorsContextType>({ colors: Colors, refreshColors: () => { } });

export const ColorsProvider = ({ children }: { children: React.ReactNode }) => {
	const [colors, setColors] = useState<ColorsI>(Colors);

	const loadColors = useCallback(() => {
		getSettings().then((settings: Settings) => {
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
