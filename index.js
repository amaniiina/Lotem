/**
 * @format
 */
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';

import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);  
