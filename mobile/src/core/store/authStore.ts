import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'kurazprep_access_token';
const REFRESH_TOKEN_KEY = 'kurazprep_refresh_token';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isGuest: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  setGuestMode: (guest: boolean) => void;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isGuest: false,
  isAuthenticated: false,
  isLoading: true,

  login: async (access: string, refresh: string) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
      isGuest: false,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isGuest: false,
    });
  },

  setGuestMode: (guest: boolean) => {
    set({ isGuest: guest, isAuthenticated: false });
  },

  loadTokens: async () => {
    try {
      const access = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      
      if (access && refresh) {
        set({ accessToken: access, refreshToken: refresh, isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
