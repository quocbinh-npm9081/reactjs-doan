import { TStage, TTaskResponse } from '../project/projectResponse'
import { WEBSOCKER_UPDATED } from './socketEnum'

export type TTaskSocketRespone = {
  id: string
  nextId: string | null
  previousId: string | null
  stageId: string
}

export type UserTaskRealtimeResponse = {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export type CommentsTaskRealtimeResponse = {
  id: string
  user: UserTaskRealtimeResponse
  taskId: string
  content: string
  parentCommentId: string
  countReply: number
  createdDate: string
  lastModifiedDate: string
}

export type ReplyCommentRealtimeResponse = {
  id: string
  name: string
  originalName: string
  taskId: string
}

export type keyDataType =
  | 'id'
  | 'stages'
  | 'tasks'
  | 'task'
  | 'taskEffects'
  | 'taskId'
  | 'assigneeId'
  | 'title'
  | 'description'
  | 'user'
  | 'taskId'
  | 'content'
  | 'parentCommentId'
  | 'countReply'
  | 'createdDate'
  | 'lastModifiedDate'
  | 'name'
  | 'originalName'
export type valueDataType =
  | TStage[]
  | TTaskSocketRespone[]
  | TTaskResponse[]
  | TTaskResponse
  | UserTaskRealtimeResponse
  | string
  | number
  | null
  | string
export type TDataStageSocketRespone = {
  type: WEBSOCKER_UPDATED
  data: Record<keyDataType, valueDataType>
}
