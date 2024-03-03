/**
 * Use this file to export public configs related to the app environment (prod, local, ect...)
 **/

export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string
export const awsApiGatewayUrl = process.env.EXPO_PUBLIC_AWS_API_GATEWAY_URL

const environment = process.env.EXPO_PUBLIC_APP_ENV as 'development' | 'test' | 'production'
if (environment !== 'production' && environment !== 'development' && environment !== 'test') {
  throw new Error(`APP_ENV must be 'production', 'development' or 'test'`)
}
