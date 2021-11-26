import React, { useState, useCallback, useEffect, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
import { openBrowserAsync } from 'expo-web-browser';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import {
  useAuthRequest,
  refreshAsync,
  makeRedirectUri,
  exchangeCodeAsync,
  AuthRequestPromptOptions,
} from 'expo-auth-session';

import { initialAuthState, User } from './auth-state';
import { AuthContext } from './auth-context';

const TOKEN_STORE_KEY = 'refresh_token';

export interface AuthProviderProps {
  children?: React.ReactNode;
  domain: string;
  clientId: string;
  redirectUri?: string;
  scope?: string;
  audience?: string;
  nonce?: string;
  [key: string]: any;
}

export function AuthProvider(props: AuthProviderProps) {
  const {
    children,
    domain,
    clientId,
    redirectUri,
    scope = 'offline_access,openid,profile,email',
    ...extraParams
  } = props;

  const [authState, setAuthState] = useState(initialAuthState);
  const [accessToken, setAccessToken] = useState<string | undefined>();

  const _redirectUri = useMemo(() => makeRedirectUri({ native: redirectUri }), [
    redirectUri,
  ]);

  const refreshAccessToken = async () => {
    const storedRefreshToken = await getItemAsync(TOKEN_STORE_KEY);
    if (!storedRefreshToken) {
      throw new Error('Refresh token is empty');
    }

    const { accessToken, idToken, refreshToken } = await refreshAsync(
      { clientId, refreshToken: storedRefreshToken, scopes: scope.split(',') },
      { tokenEndpoint: `https://${domain}/oauth/token` }
    );

    setAccessToken(accessToken);
    setAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: idToken ? jwtDecode<User>(idToken) : undefined,
    });

    if (refreshToken) {
      setItemAsync(TOKEN_STORE_KEY, refreshToken).catch(err => {
        // TODO: log error store token
      });
    }

    return accessToken;
  };

  const [request, _, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri: _redirectUri,
      responseType: 'code',
      scopes: scope.split(','),
      extraParams,
    },
    { authorizationEndpoint: `https://${domain}/authorize` }
  );

  const loginWithRedirect = useCallback(
    async (options?: AuthRequestPromptOptions) => {
      setAuthState(state => ({
        isLoading: true,
        isAuthenticated: state.isAuthenticated,
      }));

      const result = await promptAsync(options);

      if (result.type === 'success') {
        const { accessToken, idToken, refreshToken } = await exchangeCodeAsync(
          {
            clientId,
            redirectUri: _redirectUri,
            code: result.params.code,
            extraParams: request?.codeVerifier
              ? { code_verifier: request?.codeVerifier }
              : {},
          },
          { tokenEndpoint: `https://${domain}/oauth/token` }
        );

        setAccessToken(accessToken);
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: idToken ? jwtDecode<User>(idToken) : undefined,
        });

        if (refreshToken) {
          setItemAsync(TOKEN_STORE_KEY, refreshToken).catch(err => {
            // TODO: log error store token
          });
        }
      } else if (result.type === 'error') {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          error: new Error(result.error?.description ?? 'Something went wrong'),
        });
      }
    },
    [request, promptAsync]
  );

  const getAccessTokenSilently = useCallback(async () => {
    if (accessToken) {
      const { iat, exp } = jwtDecode<any>(accessToken);

      if (new Date((iat + exp) * 1000) > new Date()) {
        return accessToken;
      }
    }

    // Token expired, trying to refresh accessToken from refreshToken
    try {
      const accessToken = await refreshAccessToken();
      return accessToken;
    } catch (error) {
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  }, [accessToken]);

  const logout = useCallback(async () => {
    await openBrowserAsync(
      `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${_redirectUri}`
    );

    deleteItemAsync(TOKEN_STORE_KEY).catch(err => {
      // TODO: log error remove token
    });

    setAuthState(initialAuthState);
  }, [domain, clientId, _redirectUri]);

  useEffect(() => {
    (async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
        });
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        getAccessTokenSilently,
        loginWithRedirect,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
