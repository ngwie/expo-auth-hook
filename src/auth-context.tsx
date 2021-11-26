import { createContext } from 'react';
import { AuthRequestPromptOptions } from 'expo-auth-session';

import { AuthState, initialAuthState } from './auth-state';

export interface AuthContextInterface extends AuthState {
  getAccessTokenSilently: () => Promise<string>;

  loginWithRedirect: (options?: AuthRequestPromptOptions) => Promise<void>;

  logout: () => Promise<void>;
}

const stub = (): never => {
  throw new Error('You forgot to wrap your component in <AuthProvider>.');
};

const initialContext = {
  ...initialAuthState,
  getAccessTokenSilently: stub,
  loginWithRedirect: stub,
  logout: stub,
};

export const AuthContext = createContext<AuthContextInterface>(initialContext);
AuthContext.displayName = 'AuthContext';
