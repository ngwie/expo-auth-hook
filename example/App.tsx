import React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './dist';
import Route from './navigation';
import Config from './constants/Config';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider
        clientId={ Config.authClientId}
        domain={Config.authDomain}
        redirectUri={`${Constants.manifest?.scheme}://auth`}
        audience={Config.authAudience}
      >
        <Route />
        <StatusBar />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
