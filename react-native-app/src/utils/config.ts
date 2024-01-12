/**
 * Use this file to export public configs related to the app environment (prod, local, ect...)
 **/

const environment = process.env.EXPO_PUBLIC_APP_ENV as string
const supabaseDevUrl = process.env.EXPO_PUBLIC_SUPABASE_DEV_URL as string
const supabaseProdUrl = process.env.EXPO_PUBLIC_SUPABASE_PROD_URL as string

if (environment !== 'prod' && environment !== 'dev') {
  throw new Error(`APP_ENV must be 'prod' or 'dev'`)
}

const supabaseUrls = {
  dev: supabaseDevUrl,
  prod: supabaseProdUrl,
}
console.log(supabaseUrls)
export const supabaseUrl = supabaseUrls[environment]
