import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useThemeColor } from "@/app/hooks/useThemeColor";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor("headerBackground");
  const textColor = useThemeColor("headerText");

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="light" translucent={true} />
        <Stack
          screenOptions={{
            headerTintColor: textColor,
            headerStyle: {
              backgroundColor,
            },
            contentStyle: { backgroundColor: "transparent" },
          }}
        ></Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
