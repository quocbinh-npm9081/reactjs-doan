import { Gender, Privilege, Role, Status } from './userEnum'
import { GetUsersRequest } from './userRequest'

export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  gender: Gender
  phoneNumber: string
  role: Role
  privileges: Privilege[]
  status: Status
  lastSignedInTime?: string
}
export type UpdateUseReponse = {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: Gender
  role: Role
  privileges: Privilege[]
}
export interface UserListResponse {
  content: Content[]
  pageable: Pageable
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
  rg: GetUsersRequest
}
export interface UsersAutocompleteResponse {
  firstName: string
  lastName: string
  username: string
  status?: Status
}

export interface Content {
  id: string
  firstName: string
  lastName: string
  username: string
  role: Role
  privileges: Privilege[]
  status: Status
  lastSignedInTime?: string
}

export interface Pageable {
  sort: Sort
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface UpdateStatusUserResponse {
  id: string
  firstName: string
  lastName: string
  username: string
  gender: Gender
  phoneNumber: string
  role: Role
  privileges: string[]
  status: Status
  lastSignedInTime: string
}
