export interface LoginResponse {
  accessToken: string
  refreshToken: string
  firstName: string
  lastName: string
  username: string
  authorities: string[]
  role: string
}
