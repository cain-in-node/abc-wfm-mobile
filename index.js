/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import { configNofic } from './src/services/Notification';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

configNofic();

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
