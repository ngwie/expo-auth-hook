import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

import { useAuth } from '../dist';

export default function MainApp() {
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {auth.user?.name}</Text>
      <Button title="Logout" onPress={handleLogout}/>
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
