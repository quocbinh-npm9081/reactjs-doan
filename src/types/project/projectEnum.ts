import { DONT_MOVE, MOVE_TASK_ON_THE_BEGINNING, MOVE_TASK_ON_THE_END } from './constants'

export enum EStatusProject {
  ALL = 'ALL',
  CREATED = 'CREATED',
}
export type TStatusProjectMembers = 'LEAVED' | 'JOINED'
export enum TypeFormProject {
  CREATE_NEW_PROJECT = 'Create new project',
  UPDATE_PROJECT = 'Update project',
}

export enum EDraggingDroppingType {
  STAGE = 'Stage',
  TASK = 'Task',
}

export enum EMoveTaskPosition {
  MOVE_ON_THE_BEGINNING = MOVE_TASK_ON_THE_BEGINNING,
  MOVE_ON_THE_END = MOVE_TASK_ON_THE_END,
  DONT_MOVE_TASK = DONT_MOVE,
}
