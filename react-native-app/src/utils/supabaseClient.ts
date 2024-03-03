import 'react-native-url-polyfill/auto' // https://github.com/supabase/supabase/issues/8464
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl } from './config'

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string // 'prod' or 'local'

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
})

export default supabaseClient
