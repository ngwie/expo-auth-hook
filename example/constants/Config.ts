import Constants from 'expo-constants';

const config = {
  development: {
    authClientId: '',
    authDomain: '',
    authAudience: '',
  },
  staging: {
    authClientId: '',
    authDomain: '',
    authAudience: '',
  },
  production: {
    authClientId: '',
    authDomain: '',
    authAudience: '',
  },
};

export default config[Constants.manifest?.releaseChannel as keyof typeof config || 'development'];
