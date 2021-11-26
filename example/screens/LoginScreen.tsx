import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

import { useAuth } from '../dist';

export default function LoginScreen() {
  const auth = useAuth();

  const handleLogin = async () => {
    try {
      await auth.loginWithRedirect();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Login</Text>
      <Button title="Login" onPress={handleLogin}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
