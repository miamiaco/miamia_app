import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Alert, Button, Image as RNImage } from 'react-native';
import { getProfile } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';



interface User {
  name: string;
  email: string;
}

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchProfile = async () => {
      try {
          const response = await getProfile();
          setUser(response.data.user);
      } catch (error) {
          Alert.alert('Error', 'Failed to load profile');
      }
  };

  const handleLogout = async () => {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
    });
  };

  useEffect(() => {
      fetchProfile();
  }, []);

  if (!user) {
      return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
      </View>
  );
};

export default ProfileScreen;