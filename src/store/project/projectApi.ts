import { createApi } from '@reduxjs/toolkit/query/react'

import { EStatusProject } from '@/types/project/projectEnum'
import {
  ICreateProjectStatesResquest,
  TGetProjectsRequest,
  TTaskRequest,
  TTaskRequestUpdatePosition,
  UpdateProjectRequest,
} from '@/types/project/projectRequest'
import {
  IMyProject,
  IProjectMembers,
  IProjectResponse,
  IProjectStatesRespones,
  TTaskResponse,
} from '@/types/project/projectResponse'

import baseQueryWithReauth from '../customerFetchBaseQuery/baseQueryWithReauth'

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Projects', 'Tasks'],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getProjects: builder.query<IProjectResponse, TGetProjectsRequest>({
      query: (params: TGetProjectsRequest) => ({
        url: 'projects?',
        method: 'GET',
        params: {
          ...params,
          statuses: params?.statuses === 'ALL' ? undefined : (params?.statuses as EStatusProject),
        },
      }),
    }),
    getMyProjects: builder.query<IMyProject[], void>({
      query: () => ({
        url: 'projects/my',
        method: 'GET',
      }),
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Projects' as const, id })),
            {
              type: 'Projects' as const,
              id: 'LIST',
            },
          ]
          return final
        }
        return [{ type: 'Projects' as const, id: 'LIST' }]
      },
    }),
    getProjectById: builder.query<IMyProject, string>({
      query: (id) => ({ url: `projects/${id}`, method: 'GET' }),
    }),
    getProjectMember: builder.query<IProjectMembers[], string>({
      query: (id) => ({ url: `projects/${id}/members`, method: 'GET' }),
    }),
    getProjectStages: builder.query<IProjectStatesRespones[], string>({
      query: (id) => ({ url: `projects/${id}/stages`, method: 'GET' }),
    }),
    createProject: builder.mutation<IMyProject, { name: string; description: string | undefined }>({
      query: (body) => ({
        url: 'projects',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: (result, error) =>
        error ? [] : [{ type: 'Projects' as const, id: 'LIST' }],
    }),
    updateStage: builder.mutation<IProjectStatesRespones[], ICreateProjectStatesResquest>({
      query: (body) => ({
        url: `projects/${body.projectId}/stages`,
        method: 'PUT',
        body: {
          stages: body.stages,
        },
      }),
    }),
    getTasks: builder.query<TTaskResponse[], { id: string }>({
      query: (body) => ({
        url: 'tasks?',
        method: 'GET',
        params: { projectId: body.id },
      }),
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Tasks' as const, id })),
            {
              type: 'Tasks' as const,
              id: 'LIST',
            },
          ]
          return final
        }
        return [{ type: 'Tasks' as const, id: 'LIST' }]
      },
    }),
    addNewTask: builder.mutation<TTaskResponse[], TTaskRequest>({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body: body,
      }),
    }),
    deleteTask: builder.mutation<TTaskResponse[], string>({
      query: (body) => ({
        url: `tasks/${body}`,
        method: 'DELETE',
      }),
    }),
    addAgencyInProject: builder.mutation<void, { id: string; emails: string[] }>({
      query: (body) => ({
        url: `projects/${body.id}/members`,
        method: 'POST',
        body,
      }),
    }),
    addInvitations: builder.mutation<void, { id: string; emails: string[] }>({
      query: (body) => ({
        url: 'invitations',
        method: 'POST',
        body,
      }),
    }),
    updateProject: builder.mutation<IMyProject, { id: string; project: UpdateProjectRequest }>({
      query: (body) => ({
        url: `projects/${body.id}`,
        method: 'PUT',
        body: body.project,
      }),
    }),
    updateBatchTask: builder.mutation<TTaskResponse[], Array<TTaskRequestUpdatePosition>>({
      query: (body) => ({
        url: `tasks/batch-update`,
        method: 'POST',
        body: body,
      }),
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetMyProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectMemberQuery,
  useGetProjectStagesQuery,
  useCreateProjectMutation,
  useUpdateStageMutation,
  useGetTasksQuery,
  useAddNewTaskMutation,
  useDeleteTaskMutation,
  useAddAgencyInProjectMutation,
  useAddInvitationsMutation,
  useUpdateProjectMutation,
  useUpdateBatchTaskMutation,
} = projectApi
