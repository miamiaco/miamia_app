import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import FeedScreen from './screens/FeedScreen/FeedScreen';
import SearchScreen from './screens/SearchScreen/SearchScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import SignupScreen from './screens/SignupScreen/SignupScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import Header from './components/Header/Header';

import {
  Outfit_100Thin,
  Outfit_200ExtraLight,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from '@expo-google-fonts/outfit';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Signup">
    <Stack.Screen 
      name="Signup" 
      component={SignupScreen} 
      options={{ header: () => <Header /> }} 
    />
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ header: () => <Header /> }} 
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Feed" 
      component={FeedScreen} 
      options={{
        header: () => <Header />,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }} 
    />
    <Tab.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{
        header: () => <Header />,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="magnify" color={color} size={size} />
        ),
      }} 
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{
        header: () => <Header />,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
      }} 
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [fontsLoaded] = useFonts({
    Outfit_100Thin,
    Outfit_200ExtraLight,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuthStatus();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {isAuthenticated ? (
          <MainTabs />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </View>
  );
};

export default App;
