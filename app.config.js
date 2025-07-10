const IS_DEV = process.env.APP_VARIANT === 'development';

const getName = () => {
  if (IS_DEV) {
    return "GM (dev)";
  }

  return "Game Master";
}

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.zacharias3690.gmchatbotapp.dev";
  }

  return "com.zacharias3690.gmchatbotapp";
}

export default {
  "expo": {
    "name": getName(),
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
      "package": getUniqueIdentifier()
    },
    "ios": {
      "bundleIdentifier": getUniqueIdentifier()
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
      ],
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
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
