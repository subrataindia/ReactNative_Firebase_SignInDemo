import { registerRootComponent } from 'expo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '330241489424-7nda9ml1i4l7oms5cgsgbfg5lo2ib3nm.apps.googleusercontent.com',
});

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
