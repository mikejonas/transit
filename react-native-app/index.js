import 'react-native-gesture-handler'; // Make sure this is the absolute first line
import 'react-native-url-polyfill/auto'; // Required for supabase auth

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
