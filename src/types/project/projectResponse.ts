import { USER_DEACTIVATE } from '../auth/constants'
import {
  DO_NOT_HAVE_ACCESS_THIS_RESOURCE,
  PROJECT_ALREAEDY_TAKEN,
  PROJECT_NAME_ALREADY_TAKEN,
  STAGE_NAME_DUPLICATE,
} from './constants'
import { TStatusProjectMembers } from './projectEnum'

export interface IProjectResponse {
  content: IProjectContent[]
  pageable: IPageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: ISort
  numberOfElements: number
  first: boolean
  empty: boolean
}

export interface IMyProject extends IProjectContent {
  userProjectStatus: string
}

export interface IProjectContent {
  id: string
  name: string
  description: string
  status: string
}

export interface IPageable {
  sort: ISort
  offset: number
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

export interface ISort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface IProjectMembers {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  status: TStatusProjectMembers
}
export interface IProjectStatesRespones {
  id: string
  name: string
}

export enum EmessageResponse {
  projectNameAlreadyTaken = PROJECT_ALREAEDY_TAKEN,
  projectStageDuplicate = STAGE_NAME_DUPLICATE,
  doNotHaveAccessThisResource = DO_NOT_HAVE_ACCESS_THIS_RESOURCE,
}

export type TypeOfMessageResponse = {
  [key in EmessageResponse]?: string
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

export type TStage = {
  id: string
  name: string
}

export type TTaskResponse = {
  id: string
  title: string
  description: string
  assigneeId: string
  stageId: string
  projectId: string
  ownerId: string
  nextId: string | null | undefined
  previousId: string | null | undefined
  attachments: TAttachment[]
}

export type TAttachment = {
  id: string
  name: string
  originalName: string
  taskId: string
  commentId: string
}
export enum EmessageAddMemberResponse {
  usernameAlreadyExists = USER_DEACTIVATE,
}
export enum EmessageUpdateProjectResponse {
  projectnameAlreadyExists = PROJECT_NAME_ALREADY_TAKEN,
}
