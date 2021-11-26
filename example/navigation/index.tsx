import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../dist';

import MainApp from '../screens/MainApp';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Route() {
  const auth = useAuth();

  return (
    <NavigationContainer>
      {auth.isAuthenticated ? (
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
