import { registerRootComponent } from 'expo';
import App from './App';

if (global.ErrorUtils) {
  const defaultHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('GLOBAL EXPO ERROR CAUGHT:', error, error?.stack);
    if (defaultHandler) {
      defaultHandler(error, isFatal);
    }
  });
}

registerRootComponent(App);
