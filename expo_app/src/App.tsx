import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import TestSupabaseConnection from './components/TestSupabaseConnection';
import FacebookLoginScreen from './screens/FacebookLoginScreen/FacebookLoginScreen';
import FeedScreen from './screens/FeedScreen/FeedScreen';
import Header from './components/Header/Header'
// import SearchScreen from './screens/SearchScreen/SearchScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FacebookLogin">
      <Stack.Screen 
          name="Feed" 
          component={FeedScreen} 
          options={{
            header: () => <Header />
          }} 
        />
        <Stack.Screen name="FacebookLogin" component={FacebookLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
