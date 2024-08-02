import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { login } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './LoginScreen.styles';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async () => {
        try {
            const response = await login({ email, password });
            await AsyncStorage.setItem('token', response.data.token);
            console.log(response.data.token)
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;