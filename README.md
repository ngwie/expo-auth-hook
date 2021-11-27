# Expo Auth Hook
[![npm](https://img.shields.io/npm/v/expo-auth-hook?logo=npm)](https://www.npmjs.com/package/expo-auth-hook)
[![license](https://img.shields.io/github/license/ngwie/expo-auth-hook)](https://choosealicense.com/licenses/mit/)

Expo auth hook is OAuth 2.0 authentication and authorization management library for expo app.

This probably going to work with many OAuth 2.0 services, but I only tested with auth0 service.

## Feature

🚀 **Don't have to eject your expo app** because it use `expo-auth-session` expo sdk libs.<br/>
👨‍🚀 **Manage previous login session** with refresh token.<br/>

## Installation

```bash
npm install expo-auth-hook
# Or:
yarn add expo-auth-hook
```

It also needs other expo libraries and jwt decode
```bash
npm install expo-auth-session expo-secure-store expo-web-browser jwt-decode
# Or
yarn add expo-auth-session expo-secure-store expo-web-browser jwt-decode
```

## Usage

Use your app auth configuration and apply it to `AuthProvider`.

For `redirectUri` when in development using Expo Go app, it will be your computer ip, `exp://192.168.100.68:19000`, so make sure to add it in callback url and logout url config.

```tsx
import { AuthProvider, useAuth } from 'expo-auth-hook';

export default function App() {
  return (
    <AuthProvider
      clientId={Config.authClientId}
      domain={Config.authDomain}
      redirectUri={`${Constants.manifest?.scheme}://auth`}
      audience={Config.authAudience}
    >
      <Route />
    </AuthProvider>
  );
}

export function Route() {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
    logout
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator >
          <Stack.Screen name="Main App" component={MainApp} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
