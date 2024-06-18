import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const FacebookLoginScreen: React.FC = () => {
  const [result, setResult] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    try {
      console.log('Initiating login...');
      const response = await axios.get('http://localhost:3000/auth/facebook', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Login URL received:', response.data.url);

      window.location.href = response.data.url;
    } catch (err: any) {
      console.error('Error initiating login:', err.message);
      setError('Failed to initiate login');
    }
  };

  return (
    <View>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login with Facebook</Text>
      </Pressable>
      {result && <Text>{JSON.stringify(result)}</Text>}
      {error && <Text>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FacebookLoginScreen;