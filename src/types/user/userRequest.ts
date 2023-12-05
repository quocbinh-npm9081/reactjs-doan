import { Gender, Privilege, Role, Status } from './userEnum'

export type GetUsersRequest = {
  keyword: string
  statuses: Status | string
  roles: Role | string
  size: number
  page: number
  sort: string[]
}
export type UpdateUserRequest = {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: Gender
  role: Role
  privileges: Privilege[]
}
export type CreateUser = {
  firstName: string
  lastName: string
  username: string
  password: string
  phoneNumber: string
  gender: Gender
  role: Role
  privileges: Privilege[]
}
export interface IUserChangePasswordRequest {
  newPassword: string
  oldPassword: string
}
export type GetUsersAutocompleteRequest = {
  keyword: string
  role: Role
}
