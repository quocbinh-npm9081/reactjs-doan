import { EmessageResponse } from './auth/createUser/createUserResponse'
import { EmessageAddMemberResponse, EmessageUpdateProjectResponse } from './project/projectResponse'

export interface MessageResponse {
  message?: string
  error?: string
}

export interface DataResponse {
  timestamp?: string
  path?: string
  message?: string
}
export interface ErrorResponse {
  data: DataResponse
  status: number
}

export type ErrorResponse1 = {
  timestamp: string
  status: number
  errorCode: string | EmessageResponse
}

export interface IDataResponse {
  data: ErrorResponse1
  status: number
}

export type ErrorResponse2 = {
  timestamp: string
  status: number
  errorCode: string | EmessageAddMemberResponse
}

export interface IDataResponse2 {
  data: ErrorResponse2
  status: number
}

export type ErrorUpdateProjectResponse = {
  timestamp: string
  status: number
  errorCode: string | EmessageUpdateProjectResponse
}

export interface IDataUpdateProjectResponse {
  data: ErrorUpdateProjectResponse
  status: number
}

export interface IDataResponseError {
  error: string
  status: number
}
