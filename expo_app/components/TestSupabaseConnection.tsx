import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { supabase } from '../utils/supabase';

interface User {
  id: number;
  name: string;
  created_at: string;
}

const TestSupabaseConnection: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from<User>('Users')
          .select('*');
        if (error) throw error;
        setUsers(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
      <Button title="Login with Facebook" onPress={() => navigation.navigate('FacebookLogin')} />
    </View>
  );
};

export default TestSupabaseConnection;
