import { Gender, Privilege, Role, Status } from '../user/userEnum'
import { ATTACHMENT_IS_NOT_VALID, FAILED_TO_FETCH } from './constants'

export enum EmessageResponse {
  attachmentIsNotValid = ATTACHMENT_IS_NOT_VALID,
  failedToFetch = FAILED_TO_FETCH,
}

export interface UserTaskResponse {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: Gender
  phoneNumber?: string
  role?: Role | string
  privileges?: Privilege[]
  status?: Status
  lastSignedInTime?: string
}

export interface TaskResponse {
  id: string
  title: string
  description: string
  assigneeId: string
  stageId: string
  projectId: string
  ownerId: string
  nextId: string
  previousId: string
  attachments: AttachmentsTaskResponse[]
}

export interface AttachmentsTaskResponse {
  id: string
  name: string
  originalName: string
  taskId: string
  commentId: string
  createdDate: string
}

export interface CommentsTaskResponse {
  id: string
  user: UserTaskResponse
  taskId: string
  content: string
  parentCommentId: string
  countReply: number
  createdDate: string
  lastModifiedDate: string
}

export interface CheckListItemTaskResponse {
  id: string
  content: string
  checkListId: string
  dueDate: string
  assignee: UserTaskResponse
  isDone: boolean
}

export interface CheckListTaskResponse {
  id: string
  name: string
  taskId: string
  checkListItems: CheckListItemTaskResponse[]
}
