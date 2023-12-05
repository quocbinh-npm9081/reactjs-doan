export enum WEBSOCKET_LISTENER {
  LISTENER_PROJECTS = '/topic/projects',
  LISTENER_USERS = '/topic/users',
  LISTENER_TASKS = '/topic/tasks',
}

export enum WEBSOCKER_UPDATED {
  STAGE_UPDATED = 'STAGE_UPDATED',
  TASK_POSITION_UPDATED = 'TASK_POSITION_UPDATED',
  TASK_ADDED = 'TASK_ADDED',
  TASK_DELETED = 'TASK_DELETED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UNASSIGNED = 'TASK_UNASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  COMMENT_UPDATED = 'COMMENT_UPDATED',
  COMMENT_REPLIED = 'COMMENT_REPLIED',
}
