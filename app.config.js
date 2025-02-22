const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  "expo": {
    "name": IS_DEV ? "GM (dev)" : "Game Master",
    "slug": "gm-chatbot-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "gmbot",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/gmbot-adaptive-foreground.png",
        "backgroundColor": "#495E6A"
      },
      "package": IS_DEV ? "com.zacharias3690.gmchatbotapp.dev" : "com.zacharias3690.gmchatbotapp"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/gmbot-favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/gmbot-adaptive-foreground.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#495E6A"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "e2d07507-c422-4f94-b1c1-dace0d5263d5"
      }
    }
  }
}
