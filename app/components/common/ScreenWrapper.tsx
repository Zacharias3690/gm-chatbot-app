import React from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

type BaseProps = {
  children: React.ReactNode;
  withScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isKeyboardAware?: boolean;
};

type KeyboardAwareProps = BaseProps &
  KeyboardAwareScrollViewProps & {
    isKeyboardAware: true;
  };

type Props = BaseProps & (KeyboardAwareProps | ScrollViewProps);

const ScreenWrapper = ({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  isKeyboardAware = false,
  ...rest
}: Props) => {
  const containerStyle = [
    {
      flex: 1,
      gap: 16,
    },
  ];

  const ScrollViewComponent = isKeyboardAware
    ? KeyboardAwareScrollView
    : ScrollView;

  return (
    <>
      {withScrollView ? (
        <ScrollViewComponent
          {...rest}
          contentContainerStyle={contentContainerStyle}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[containerStyle, style]}
        >
          {children}
        </ScrollViewComponent>
      ) : (
        <View style={[containerStyle, style]}>{children}</View>
      )}
    </>
  );
};

export default ScreenWrapper;
