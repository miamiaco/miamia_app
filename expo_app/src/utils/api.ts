import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//change to delpoyment url when it works 
const api = axios.create({
    baseURL: 'http://localhost:3000/api/users',
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface UserData {
    email: string;
    password: string;
    name?: string;
}

export const signup = (data: UserData) => api.post('/signup', data);
export const login = (data: Omit<UserData, 'name'>) => api.post('/login', data);
export const getProfile = () => api.get('/profile');
