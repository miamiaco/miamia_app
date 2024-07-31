import React, { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import FacebookLoginScreen from './screens/FacebookLoginScreen/FacebookLoginScreen';
import FeedScreen from './screens/FeedScreen/FeedScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import SearchScreen from './screens/SearchScreen/SearchScreen';
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

const App: React.FC = () => {
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

  if (!fontsLoaded) {
    return null; // Optionally render a splash screen or loading indicator here
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen 
            name="Feed" 
            component={FeedScreen} 
            options={{
              header: () => <Header />,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" />
              )
            }} 
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{
              header: () => <Header />,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="Search" />
              )
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{
              header: () => <Header />,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="Profile" />
              )
            }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default App;
