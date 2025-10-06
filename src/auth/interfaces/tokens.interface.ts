export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  jti?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
