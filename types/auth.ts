export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
