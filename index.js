/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { configNofic } from './src/services/Notification';
import {name as appName} from './app.json';

configNofic();

AppRegistry.registerComponent(appName, () => App);
