import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import TestSupabaseConnection from './components/TestSupabaseConnection';
import FacebookLoginScreen from './screens/FacebookLoginScreen';
import FeedScreen from './screens/FeedScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Feed">
        <Stack.Screen name="Feed" component={FeedScreen} />
        <Stack.Screen name="FacebookLogin" component={FacebookLoginScreen} />
        <Stack.Screen name='FeedScreen' component={FeedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
