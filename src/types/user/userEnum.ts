export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ALL = 'ALL',
  REGISTERING = 'REGISTERING',
}

export enum Role {
  ALL = 'ALL',
  AGENCY = 'AGENCY',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  TALENT = 'TALENT',
}

export enum Required {
  TRUE = 'TRUE',
  FALSE = 'FALSE',
}

export enum Privilege {
  CREATE_PROJECT = 'CREATE_PROJECT',
  VIEW_MY_PROJECT = 'VIEW_MY_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  VIEW_PROFILE = 'VIEW_PROFILE',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CREATE_INVITATION = 'CREATE_INVITATION',
  UPDATE_INVITATION = 'UPDATE_INVITATION',
  VIEW_MY_INVITATION = 'VIEW_MY_INVITATION',
  CREATE_TASK = 'CREATE_TASK',
  VIEW_TASK = 'VIEW_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
}

export enum Sort {
  asc = 'asc',
  desc = 'desc',
}
