import 'react-native-url-polyfill/auto' // https://github.com/supabase/supabase/issues/8464
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl } from './config'

// doing this for now since jest won't work otherwise
// https://github.com/expo/expo/issues/26513
const env = process.env
const supabaseAnonKey = env.EXPO_PUBLIC_SB_ANON_KEY as string // 'prod' or 'local'

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
})

export default supabaseClient
