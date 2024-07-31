import { ExpoConfig, ConfigContext } from 'expo/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo_app',
  slug: 'expo-app',
  version: '1.0.0',
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    eas: {
        "projectId": "c59934c7-494c-4d74-bc9a-edac7dd6013b"
      }
  },
});
