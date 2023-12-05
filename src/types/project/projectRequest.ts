import { EStatusProject } from './projectEnum'
// eslint-disable-next-line import/namespace
import { TAttachment, TStage, TTaskResponse } from './projectResponse'

export type TGetProjectsRequest = {
  keyword: string
  statuses: EStatusProject | string
  size: number
  page: number
  sort: string[]
}

export interface ICreateProjectStatesResquest {
  projectId: string
  stages: TStage[]
}

export type TTaskRequest = {
  title: string
  description: string
  projectId: string
  stageId: string
  previousId: string | null
  nextId: string | null
  [key: string]: string | null
}
export type UpdateProjectRequest = {
  name: string
  description: string | undefined
  status?: EStatusProject | string
}

export type TTaskRequestUpdatePosition = {
  id: string | undefined
  stageId: string | null | undefined
  preTaskId: string | null | undefined
  nextTaskId: string | null | undefined
}

export type TTaskBehindActiveTaskUpdated = {
  previousId: string | undefined | null
  id?: string | undefined
  title?: string | undefined
  description?: string | undefined
  assigneeId?: string | undefined
  stageId?: string | undefined
  projectId?: string | undefined
  ownerId?: string | undefined
  nextId?: string | undefined | null
  attachments?: TAttachment[] | undefined
}
export type TTaskInFormOfActiveTaskUpdated = {
  nextId: string | undefined | null
  id?: string | undefined
  title?: string | undefined
  description?: string | undefined
  assigneeId?: string | undefined
  stageId?: string | undefined
  projectId?: string | undefined
  ownerId?: string | undefined
  previousId?: string | undefined | null
  attachments?: TAttachment[] | undefined
}

export type TUpdateTaskAfterMoveTask =
  | TTaskResponse
  | TTaskBehindActiveTaskUpdated
  | TTaskInFormOfActiveTaskUpdated
