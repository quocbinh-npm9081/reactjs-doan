import { Gender, Privilege, Role, Status } from '../user/userEnum'
import { INVALID_KEY_CONFIRM_EMAIL, OLD_PASSWORD_IS_NOT_CORRECT } from './constants'

export type UserProfile = {
  id?: string
  username?: string
  firstName?: string
  lastName?: string
  gender?: Gender
  phoneNumber?: string
  role?: Role | string
  privileges?: Privilege[]
  status?: Status
  lastSignedInTime?: string
}
export type UserProfileUpdate = {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: Gender | string
}
export enum EmessageResponse {
  oldPasswordIsNotCorrect = OLD_PASSWORD_IS_NOT_CORRECT,
  invalidKeyConfirmEmail = INVALID_KEY_CONFIRM_EMAIL,
}
export type TypeOfMessageResponse = {
  [key in EmessageResponse]: string
}
export type ErrorResponse = {
  timestamp: string
  status: number
  errorCode: string | EmessageResponse
}
export interface IDataResponse {
  data: ErrorResponse
  status: number
}
