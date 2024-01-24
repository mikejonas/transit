/**
 * Use this file to export public configs related to the app environment (prod, local, ect...)
 **/

// @TODO make sure your fix this here and in other locations
// doing this for now since jest won't work otherwise
// https://github.com/expo/expo/issues/26513
const env = process.env
const environment = env.EXPO_PUBLIC_APP_ENV as string
const supabaseDevUrl = env.EXPO_PUBLIC_SUPABASE_DEV_URL as string
const supabaseProdUrl = env.EXPO_PUBLIC_SUPABASE_PROD_URL as string


if (environment !== 'prod' && environment !== 'dev') {
  throw new Error(`APP_ENV must be 'prod' or 'dev'`)
}

const supabaseUrls = {
  dev: supabaseDevUrl,
  prod: supabaseProdUrl,
}
console.log({environment, ...supabaseUrls})
export const supabaseUrl = supabaseUrls[environment]
