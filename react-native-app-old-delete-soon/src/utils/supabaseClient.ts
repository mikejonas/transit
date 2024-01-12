import { SB_ANON_KEY } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supabaseUrl } from './config'

const supabaseAnonKey = SB_ANON_KEY!
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
})

export default supabaseClient
