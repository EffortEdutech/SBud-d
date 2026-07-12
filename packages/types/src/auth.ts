export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

export interface AuthSessionState {
  user: AuthenticatedUser | null;
  accessToken: string | null;
}

export interface EmailPasswordCredentials {
  email: string;
  password: string;
}
