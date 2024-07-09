import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Feed: undefined;
};

type FacebookLoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Feed'
>;

type Props = {
  navigation: FacebookLoginScreenNavigationProp;
};

const FacebookLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [result] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  const API_URL = 'https://miamiaapp-ronjakovero-ronjakoveros-projects.vercel.app';

  const handleLogin = async () => {
    try {
      console.log('Initiating login...');
      const response = await axios.get(`${API_URL}/auth/facebook`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login URL received:', response.data.url);

      const redirectUrl = Linking.createURL('exp://');

      const authUrl = `${response.data.url}&redirectUri=${encodeURIComponent(redirectUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type === 'success') {
        console.log('Login successful')
        navigation.replace('Feed');
      } else {
        console.log('Login not successful')
      }
    
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
