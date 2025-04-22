import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the auth state
export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  email_verified: boolean;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  provider?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * Redux slice for authentication and user state.
 * Handles login, logout, user info, and error/loading states.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Start login (sets loading)
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    // Update user profile
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    // Login success: set user and authenticated
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    // Login failure: set error
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
    // Logout: clear user
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    // Set user roles (for role-based access)
    setRoles(state, action: PayloadAction<string[]>) {
      if (state.user) {
        state.user.roles = action.payload;
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setRoles, updateUser } = authSlice.actions;
export default authSlice.reducer;
