/**
 * Use this file to export public configs related to the app environment (prod, local, ect...)
 **/

import { APP_ENV } from '@env'

const environment = APP_ENV // 'prod' or 'local'
if (environment !== 'prod' && environment !== 'local') {
  throw new Error(`APP_ENV must be 'prod' or 'local'`)
}

const supabaseUrls = {
  local: 'http://localhost:54321',
  prod: 'https://evsqlmjsaibcaccunysk.supabase.co',
}

export const supabaseUrl = supabaseUrls[environment]
