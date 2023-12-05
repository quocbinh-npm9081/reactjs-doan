export type AuthState = {
  isAuthenticated: boolean
  accessToken: string | undefined
  refreshToken: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  username: string | undefined
  authorities: string[] | undefined
  redirect: string | undefined
  role: string | undefined
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  type: string
  id: string
  firstName: string
  lastName: string
  username: string
  authorities: string[]
  role: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export type AccessTokenType = {
  iat: number
  exp: number
  email: string
  roles: Array<string>
  userId: string
}
export type RefreshTokenType = {
  iat: number
  exp: number
  email: string
  roles: Array<string>
  userId: string
}
export const FETCH_AUTH_ERROR = 'FETCH_ERROR'
