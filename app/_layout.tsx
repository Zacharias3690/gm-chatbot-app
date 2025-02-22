import {Stack} from "expo-router";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {useColorScheme, View} from "react-native";
import {useThemeColor} from "@/app/hooks/useThemeColor";
import {StatusBar} from "expo-status-bar";
import Home from "@/app/index";
import ThemedButton from "@/app/components/common/ThemedButton";

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
