import Colors, { ColorsI } from '@constants/Colors';
import { useMemo } from 'react';
import useColors from './useColors';

const useStyles = <T>(styling: (colors: ColorsI) => T): { styles: T; colors: typeof Colors } => {
	const colors = useColors();
	const styles = useMemo(() => styling(colors), [colors, styling]);

	return { styles, colors };
};

export default useStyles;
