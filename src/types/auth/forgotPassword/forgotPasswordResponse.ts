import {
  USER_INVALID_KEY,
  USER_IS_NOT_ACTIVE,
  USER_IS_UNVERIFIED,
  USER_NOT_FOUND,
  USERNAME_PASSWORD_INCORRECT,
} from '../constants'

export enum EmessageResponse {
  userIsNotActive = USER_IS_NOT_ACTIVE,
  userNotFound = USER_NOT_FOUND,
  userIsUnverified = USER_IS_UNVERIFIED,
  userInvalidKey = USER_INVALID_KEY,
  userNameOrPasswordInCorrect = USERNAME_PASSWORD_INCORRECT,
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
