import {StyleSheet, TextInput, TextInputProps} from "react-native";
import {useThemeColor} from "@/app/hooks/useThemeColor";

const ThemedTextInput = (props: TextInputProps) => {
    const textColor = useThemeColor('text');
    const borderColor = useThemeColor('border');

    return (
        <TextInput
            {...props}
            style={{
                ...styles.textInput,
                color: textColor,
                borderColor: borderColor,
            }}/>
    );
}

const styles = StyleSheet.create({
    textInput: {
        padding: 8,
        paddingLeft: 8,
        paddingRight: 0,
        margin: 12,
        borderWidth: 1,
        borderRadius: 4,
        flexGrow: 1
    }
});

export default ThemedTextInput;