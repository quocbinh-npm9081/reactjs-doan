import { createApi } from '@reduxjs/toolkit/query/react'

import { TaskUpdateRequest } from '@/types/task/taskRequest'
import {
  AttachmentsTaskResponse,
  CheckListItemTaskResponse,
  CheckListTaskResponse,
  CommentsTaskResponse,
  TaskResponse,
} from '@/types/task/taskResponse'

import baseQueryWithReauth from '../customerFetchBaseQuery/baseQueryWithReauth'

export const taskApi = createApi({
  reducerPath: 'taskApi',
  tagTypes: ['Tasks'],
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getTaskById: builder.query<TaskResponse, string>({
      query: (id) => ({ url: `tasks/${id}`, method: 'GET' }),
    }),
    updateTask: builder.mutation<
      TaskResponse,
      { id: string | undefined; task: TaskUpdateRequest[] }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}`,
        method: 'PATCH',
        body: arg.task,
      }),
    }),
    assignTask: builder.mutation<TaskResponse, { id: string; userId: string }>({
      query: (arg) => ({
        url: `tasks/${arg.id}/assign`,
        method: 'POST',
        body: { userId: arg.userId },
      }),
    }),
    unassignTask: builder.mutation<TaskResponse, string>({
      query: (id) => ({
        url: `tasks/${id}/unassign`,
        method: 'POST',
      }),
    }),
    uploadAttachments: builder.mutation<
      AttachmentsTaskResponse,
      { id: string; formData: FormData }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/attachments`,
        method: 'POST',
        body: arg.formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        formData: true,
      }),
    }),
    deleteAttachment: builder.mutation<void, { id: string; attachmentId: string }>({
      query: (arg) => ({
        url: `tasks/${arg.id}/attachments/${arg.attachmentId}`,
        method: 'DELETE',
      }),
    }),
    updateAttachment: builder.mutation<
      AttachmentsTaskResponse,
      { id: string; attachmentId: string; name: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/attachments/${arg.attachmentId}`,
        method: 'PUT',
        body: { name: arg.name },
      }),
    }),
    getComment: builder.query<CommentsTaskResponse[], string>({
      query: (id) => ({
        url: `tasks/${id}/comments`,
        method: 'GET',
      }),
    }),
    postComment: builder.mutation<
      CommentsTaskResponse,
      { id: string; comment: { content: string | undefined; parentId: string | undefined } }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/comments`,
        method: 'POST',
        body: arg.comment,
      }),
    }),
    updateComment: builder.mutation<
      CommentsTaskResponse,
      { id: string; commentId: string; content: string | undefined }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/comments/${arg.commentId}`,
        method: 'PUT',
        body: { content: arg.content },
      }),
    }),
    deleteComment: builder.mutation<void, { id: string; commentId: string }>({
      query: (arg) => ({
        url: `tasks/${arg.id}/comments/${arg.commentId}`,
        method: 'DELETE',
      }),
    }),
    getChildrenComment: builder.query<
      CommentsTaskResponse[],
      { id: string | undefined; commentId: string | undefined }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/comments/${arg.commentId}/replies`,
        method: 'GET',
      }),
    }),
    getChecklist: builder.query<CheckListTaskResponse[], string>({
      query: (id) => ({
        url: `tasks/${id}/check-list`,
        method: 'GET',
      }),
    }),
    createCheckList: builder.mutation<CheckListTaskResponse, { id: string; name: string }>({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list`,
        method: 'POST',
        body: { name: arg.name },
      }),
    }),
    updateCheckList: builder.mutation<
      CheckListTaskResponse,
      { id: string; checkListId: string; name: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}`,
        method: 'PUT',
        body: { name: arg.name },
      }),
    }),
    deleteCheckList: builder.mutation<void, { id: string; checkListId: string }>({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}`,
        method: 'DELETE',
      }),
    }),
    createCheckListItem: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; content: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item`,
        method: 'POST',
        body: { content: arg.content },
      }),
    }),
    updateCheckListItem: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; checkListItemId: string; content: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}`,
        method: 'PUT',
        body: { content: arg.content },
      }),
    }),
    deleteCheckListItem: builder.mutation<
      void,
      { id: string; checkListId: string; checkListItemId: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}`,
        method: 'DELETE',
      }),
    }),
    updateStatusCheckListItem: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; checkListItemId: string; status: boolean }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}/status`,
        method: 'PUT',
        body: { status: arg.status },
      }),
    }),
    assignCheckListItem: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; checkListItemId: string; userId: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}/assign`,
        method: 'PUT',
        body: { userId: arg.userId },
      }),
    }),
    unAssignCheckListItem: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; checkListItemId: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}/un-assign`,
        method: 'PUT',
      }),
    }),
    updateDueDate: builder.mutation<
      CheckListItemTaskResponse,
      { id: string; checkListId: string; checkListItemId: string; dueDate: string }
    >({
      query: (arg) => ({
        url: `tasks/${arg.id}/check-list/${arg.checkListId}/check-list-item/${arg.checkListItemId}/due-date`,
        method: 'PUT',
        body: { dueDate: arg.dueDate },
      }),
    }),
  }),
})

export const {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useAssignTaskMutation,
  useUnassignTaskMutation,
  useUploadAttachmentsMutation,
  useDeleteAttachmentMutation,
  useUpdateAttachmentMutation,
  useGetCommentQuery,
  usePostCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetChildrenCommentQuery,
  useGetChecklistQuery,
  useCreateCheckListMutation,
  useUpdateCheckListMutation,
  useDeleteCheckListMutation,
  useCreateCheckListItemMutation,
  useUpdateCheckListItemMutation,
  useDeleteCheckListItemMutation,
  useUpdateStatusCheckListItemMutation,
  useAssignCheckListItemMutation,
  useUnAssignCheckListItemMutation,
  useUpdateDueDateMutation,
} = taskApi
