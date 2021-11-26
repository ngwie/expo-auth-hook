export interface User {
  [key: string]: any;
}

export interface AuthState {
  user?: User;
  error?: Error;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};
