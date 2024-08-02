import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { signup } from '../../utils/api';
import styles from './SignupScreen.styles';

const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');

    const handleSignup = async () => {
        try {
            const response = await signup({ email, password, name });
            Alert.alert('Success', 'User created');
            navigation.navigate('Login');
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
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                />
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
                <Pressable style={styles.button} onPress={handleSignup}>
                    <Text style={styles.buttonText}>Signup</Text>
                </Pressable>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Already have an account? Log in</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;