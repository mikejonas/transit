import { SB_URL, SB_ANON_KEY } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = SB_URL!
const supabaseAnonKey = SB_ANON_KEY!
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  },
})

export default supabaseClient
