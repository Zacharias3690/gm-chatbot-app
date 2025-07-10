import {useColorScheme} from "react-native";
import { Colors } from "@/app/constants/Colors";


export const useThemeColor = (
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string => {
    const theme = useColorScheme() ?? 'light';

    return Colors[theme][colorName];
}