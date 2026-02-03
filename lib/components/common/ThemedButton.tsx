import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { FC, ReactNode } from "react";
import { Colors } from "@/lib/constants/Colors";
import { BorderRadius } from "@/lib/constants/Borders";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

const ThemedButton: FC<{
  onPress: () => void;
  children: ReactNode;
}> = ({ onPress, children }) => {
  const backgroundColor = useThemeColor("primary");
  const textColor = useThemeColor("onPrimaryText");

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.button,
        backgroundColor,
      }}
    >
      <Text
        style={{
          ...styles.buttonText,
          color: textColor,
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: 8,
    borderRadius: BorderRadius.md,
  },
  buttonText: {},
});

export default ThemedButton;
