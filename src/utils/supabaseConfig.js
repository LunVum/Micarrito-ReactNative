// src/utils/supabaseConfig.js
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

function getExtra(key) {
  // manifest (bare workflow o algunas versiones de Expo Go)
  if (Constants.manifest?.extra?.[key] != null) {
    return Constants.manifest.extra[key];
  }
  // manifest2 (Expo Go más reciente)
  if (Constants.manifest2?.extra?.[key] != null) {
    return Constants.manifest2.extra[key];
  }
  // expoConfig (EAS build, web)
  if (Constants.expoConfig?.extra?.[key] != null) {
    return Constants.expoConfig.extra[key];
  }
  throw new Error(`Missing extra key "${key}" — revisa tu app.json/app.config.js`);
}

const supabaseUrl = getExtra('SUPABASE_URL');
const supabaseKey = getExtra('SUPABASE_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey);





