import { SettingsIcon } from '@assets/icons/SettingsIcon';
import Colors from '@constants/Colors';
import useStyles from '@utils/useStyles';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';


const SettingsFab = React.memo(({ onPress, style, disabled }: Props) => {
	const { styles } = useStyles(styling)

	return (
		<View style={styles.main}>
			<Pressable
				onPress={onPress}
				style={({ pressed }) => [styles.fab, style, pressed && styles.fabPressed, disabled && styles.fabDisabled]}
				disabled={disabled}
				accessibilityLabel="Open settings"
			>
				<SettingsIcon />
			</Pressable>
		</View>
	);
})

const styling = (colors: typeof Colors) => StyleSheet.create({
	main: {
		position: 'absolute',
		top: 70,
		right: 25,
		zIndex: 100
	},
	fab: {
		width: 60,
		height: 60,
		borderRadius: 100,
		backgroundColor: colors.default.buttonInput,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 10,
		alignSelf: 'flex-end',
	},
	fabPressed: {
		transform: [{ scale: 0.95 }],
		elevation: 5,
	},
	fabDisabled: {
		backgroundColor: colors.default.buttonDisabled,
	},
});

type Props = {
	onPress: () => void;
	style?: ViewStyle;
	disabled?: boolean;
};

export default SettingsFab;
