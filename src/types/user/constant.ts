import { Privilege, Required, Role } from './userEnum'

export const OPTIONS = [
  {
    label: 'CREATE PROJECT',
    value: Privilege.CREATE_PROJECT,
    roles: [Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'VIEW MY PROJECT',
    value: Privilege.VIEW_MY_PROJECT,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.TRUE,
  },
  {
    label: 'UPDATE PROJECT',
    value: Privilege.UPDATE_PROJECT,
    roles: [Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'DELETE PROJECT',
    value: Privilege.DELETE_PROJECT,
    roles: [Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'UPDATE PROFILE',
    value: Privilege.UPDATE_PROFILE,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.TRUE,
  },
  {
    label: 'VIEW PROFILE',
    value: Privilege.VIEW_PROFILE,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.TRUE,
  },
  {
    label: 'CREATE INVITATION',
    value: Privilege.CREATE_INVITATION,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'UPDATE INVITATION',
    value: Privilege.UPDATE_INVITATION,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'CREATE TASK',
    value: Privilege.CREATE_TASK,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'VIEW TASK',
    value: Privilege.VIEW_TASK,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.TRUE,
  },
  {
    label: 'UPDATE TASK',
    value: Privilege.UPDATE_TASK,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
  {
    label: 'DELETE TASK',
    value: Privilege.DELETE_TASK,
    roles: [Role.AGENCY, Role.PROJECT_MANAGER],
    required: Required.FALSE,
  },
]

export const privilegesAgencyFalse = OPTIONS.filter((x) => {
  return x.roles?.includes(Role.AGENCY) && x.required?.includes(Required.FALSE)
})

export const privilegesAgencyTrue = OPTIONS.filter((x) => {
  return x.roles?.includes(Role.AGENCY) && x.required?.includes(Required.TRUE)
})

export const privilegesProjectmanagerFalse = OPTIONS.filter((x) => {
  return x.roles?.includes(Role.PROJECT_MANAGER) && x.required?.includes(Required.FALSE)
})

export const privilegesProjectmanagerTrue = OPTIONS.filter((x) => {
  return x.roles?.includes(Role.PROJECT_MANAGER) && x.required?.includes(Required.TRUE)
})

export const privilegesAgencyTrueValue = privilegesAgencyTrue.map((opt) => opt.value)

export const privilegesProjectmanagerTrueValue = privilegesProjectmanagerTrue.map(
  (opt) => opt.value,
)
