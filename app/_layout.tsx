import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme} from "react-native";
import {useThemeColor} from "@/app/hooks/useThemeColor";
import {StatusBar} from "expo-status-bar";
import Home from "@/app/index";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const backgroundColor = useThemeColor('headerBackground');
    const textColor = useThemeColor('headerText');

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={"auto"}/>
            <Stack
                screenOptions={{
                    headerTintColor: textColor,
                    headerStyle: {
                        backgroundColor
                    }
                }}>
            </Stack>
        </ThemeProvider>
    );
}
