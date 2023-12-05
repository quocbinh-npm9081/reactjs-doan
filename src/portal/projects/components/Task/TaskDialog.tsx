import {
  ArrowRightAltOutlined,
  AttachmentOutlined,
  ChatOutlined,
  CheckBoxOutlined,
  CloseOutlined,
  CreditScoreOutlined,
  DescriptionOutlined,
  LabelOutlined,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import AlertDialog from '@/portal/components/Dialogs/AlertDialog'
import WebSocketService from '@/portal/services/webSocketServices'
import { useAuth } from '@/store/auth/useAuth'
import {
  useCreateCheckListItemMutation,
  useCreateCheckListMutation,
  useDeleteAttachmentMutation,
  useDeleteCheckListItemMutation,
  useDeleteCheckListMutation,
  useDeleteCommentMutation,
  useGetChecklistQuery,
  useGetChildrenCommentQuery,
  useGetCommentQuery,
  useGetTaskByIdQuery,
  usePostCommentMutation,
  useUpdateAttachmentMutation,
  useUpdateCheckListItemMutation,
  useUpdateCheckListMutation,
  useUpdateCommentMutation,
  useUpdateStatusCheckListItemMutation,
} from '@/store/task/taskApi'
import { IProjectMembers, TAttachment, TTaskResponse } from '@/types/project/projectResponse'
// eslint-disable-next-line import/namespace
import { WEBSOCKER_UPDATED, WEBSOCKET_LISTENER } from '@/types/socket/socketEnum'
import {
  CommentsTaskRealtimeResponse,
  TDataStageSocketRespone,
  // eslint-disable-next-line import/namespace
} from '@/types/socket/socketResponse'
import {
  CheckListItemTaskResponse,
  CheckListTaskResponse,
  CommentsTaskResponse,
  TaskResponse,
} from '@/types/task/taskResponse'

import TaskAddAssigneeDialog from './TaskAddAssigneeDialog'
import TaskAttachment from './TaskAttachment'
import TaskAttachmentDialog from './TaskAttachmentDialog'
import TaskCheckList from './TaskCheckList'
import TaskChecklistDialog from './TaskChecklistDialog'
import TaskMarkdown from './TaskMarkdown'
import TaskShowComment from './TaskShowComment'
import TaskTitleDialog from './TaskTitleDialog'

interface Props {
  updateRealtimeTaskDesc: (desc: string) => void
  updateRealTimeTaskTitle: (title: string) => void
  updateAssigneeUser: (firstName: string, lastName: string) => void
  isOpenTaskDialog: boolean
  setIsOpenTaskDialog: (value: boolean) => void
  task: TTaskResponse
  isIdTaskSelect: string | undefined
  stageName?: string
  updateTaskTitle: (id: string | undefined, name: string | undefined) => void
  updateTaskDescription: (id: string | undefined, name: string | undefined) => void
  members: IProjectMembers[] | undefined
  isSuccess: boolean
  onOpenMoveTaskForm?: (task: TTaskResponse) => void
  onDeleteTask: (taskId: string) => void
}

export default function TaskDialog({
  updateRealtimeTaskDesc,
  updateRealTimeTaskTitle,
  updateAssigneeUser,
  isOpenTaskDialog,
  setIsOpenTaskDialog,
  task,
  isIdTaskSelect,
  stageName,
  updateTaskTitle,
  updateTaskDescription,
  members,
  isSuccess,
  onOpenMoveTaskForm,
  onDeleteTask,
}: Props) {
  const auth = useAuth()
  let webSocketService
  const [taskInfo, setTaskInfo] = useState<TaskResponse | undefined>()
  const { data, refetch, isSuccess: isSuccessGetTask } = useGetTaskByIdQuery(task.id)
  const {
    data: commentData,
    isSuccess: isGetCommentDataSuccess,
    refetch: refetchComment,
  } = useGetCommentQuery(String(isIdTaskSelect), { skip: isIdTaskSelect === undefined })

  const [deleteAttachment, resultDeleteAttachment] = useDeleteAttachmentMutation()
  const [updateAttachment, resultUpdateAttachment] = useUpdateAttachmentMutation()
  const [postComment, resultPostComment] = usePostCommentMutation()
  const [updateComment, resultUpdateComment] = useUpdateCommentMutation()
  const [deleteComment, resultDeleteComment] = useDeleteCommentMutation()

  const [skipGetChildrenComment, setSkipGetChildrenComment] = useState<boolean>(true)
  const [isReplyCommentSelected, setIsReplyCommentSelected] = useState<
    CommentsTaskResponse | undefined
  >()
  const {
    data: replyCommentData,
    isLoading: isLoadingReplyComment,
    isSuccess: isSuccessReplyComment,
    refetch: refetchReplyComment,
  } = useGetChildrenCommentQuery(
    {
      id: isReplyCommentSelected?.taskId,
      commentId: isReplyCommentSelected?.id,
    },
    { skip: skipGetChildrenComment },
  )

  const { data: dataGetCheckList, refetch: refetchGetCheckList } = useGetChecklistQuery(task.id)
  const [createCheckList, resultCreateCheckList] = useCreateCheckListMutation()
  const [updateCheckList, resultUpdateCheckList] = useUpdateCheckListMutation()
  const [deleteCheckList, resultDeleteCheckList] = useDeleteCheckListMutation()
  const [createCheckListItem, resultCreateCheckListItem] = useCreateCheckListItemMutation()
  const [updateCheckListItem, resultUpdateCheckListItem] = useUpdateCheckListItemMutation()
  const [deleteCheckListItem, resultDeleteCheckListItem] = useDeleteCheckListItemMutation()
  const [updateStatusCheckListItem, resultUpdateStatusCheckListItem] =
    useUpdateStatusCheckListItemMutation()

  const [editModeTitle, setEditModeTitle] = useState<boolean>(false)
  const [taskDescription, setTaskDescription] = useState<string | undefined>()
  const [taskComment, setTaskComment] = useState<string | undefined>()
  const [firstNameOwner, setFirstNameOwner] = useState<string>('')
  const [lastNameOwner, setLastNameOwner] = useState<string>('')
  const [idAssignee, setIdAssignee] = useState<string>('')
  const [firstNameAssignee, setFirstNameAssignee] = useState<string>(' ')
  const [lastNameAssignee, setLastNameAssignee] = useState<string>('')
  const [isOpenTaskAddAssigneeDialog, setIsOpenTaskAddAssigneeDialog] = useState<boolean>(false)
  const [isOpenTaskCheckListDialog, setIsOpenTaskCheckListDialog] = useState<boolean>(false)
  const [isOpenTaskAttachmentDialog, setIsOpenTaskAttachmentDialog] = useState<boolean>(false)
  const [isOpenDeleteAttachmentDialog, setIsOpenDeleteAttachmentDialog] = useState<boolean>(false)
  const [isOpenUpdateAttachmentDialog, setIsOpenUpdateAttachmentDialog] = useState<boolean>(false)
  const [isOpenDeleteTaskDialog, setIsOpenDeleteTaskDialog] = useState<boolean>(false)
  const [isAttachment, setIsAttachment] = useState<TAttachment>()
  const [isNameAttachmentUpadte, setIsNameAttachmentUpadte] = useState<string | undefined>()
  const [isShowMarkdownDescription, setIsShowMarkdownDescription] = useState<boolean>(false)
  const [isShowMarkdownComment, setIsShowMarkdownComment] = useState<boolean>(false)
  const [isShowMarkdownPostComment, setIsShowMarkdownPostComment] = useState<boolean>(false)
  const [isShowMarkdownReplyComment, setIsShowMarkdownReplyComment] = useState<boolean>(false)
  const [isShowMarkdownEditReplyComment, setIsShowMarkdownEditReplyComment] =
    useState<boolean>(false)
  const [isInitSocket, setIsInitSocket] = useState(false)

  const [idCommentSelected, setIdCommentSelected] = useState<string>('')
  const [isCommentSelected, setIsCommentSelected] = useState<CommentsTaskResponse | undefined>()

  const [realtimeComment, setRealtimeComment] = useState<CommentsTaskResponse[] | undefined>(
    commentData,
  )
  const [realtimeReplyComment, setRealtimeReplyComment] = useState<
    CommentsTaskResponse[] | undefined
  >(replyCommentData)
  const [realtimeAddComment, setRealtimeAddComment] = useState<CommentsTaskRealtimeResponse>()
  const [realtimeUpdateComment, setRealtimeUpdateComment] = useState<CommentsTaskRealtimeResponse>()
  const [realtimeCommentDelete, setRealtimeCommentDelete] = useState<
    CommentsTaskRealtimeResponse | undefined
  >()
  const [checklistSelect, setChecklistSelect] = useState<CheckListTaskResponse>()
  const [checklistItemSelect, setChecklistItemSelect] = useState<CheckListItemTaskResponse>()
  const [titleCheckList, setTitleCheckList] = useState<string>('')
  const [textCheckListItem, setTextCheckListItem] = useState<string>('')
  const [isAddNewItem, setIsAddNewItem] = useState<boolean>(false)
  const [textTitleCheckList, setTextTitleCheckList] = useState<string>('')

  const onAfterCloseDialog = () => {
    setIsOpenDeleteTaskDialog(false)
  }
  const onAfterConfirm = () => onDeleteTask(task.id)

  useEffect(() => {
    if (data) {
      setTaskInfo(data)
      updateRealtimeTaskDesc(data.description)
    }
  }, [data])

  useEffect(() => {
    if (isReplyCommentSelected?.id) {
      setSkipGetChildrenComment(false)
    }
  }, [isReplyCommentSelected])

  useEffect(() => {
    if (isSuccess) {
      setSkipGetChildrenComment(true)
    }
  }, [isSuccess])

  const handleDeleteAttachment = (item: TAttachment) => {
    setIsOpenDeleteAttachmentDialog(true)
    setIsAttachment(item)
  }
  const handleUpdateAttachment = (item: TAttachment) => {
    setIsOpenUpdateAttachmentDialog(true)
    setIsAttachment(item)
  }
  const handleAgreeDelete = () => {
    if (isAttachment) {
      deleteAttachment({ id: isAttachment.taskId, attachmentId: isAttachment.id })
    }
  }
  const handleUpdate = () => {
    if (isAttachment && isNameAttachmentUpadte) {
      updateAttachment({
        id: isAttachment.taskId,
        attachmentId: isAttachment.id,
        name: isNameAttachmentUpadte,
      })
    }
  }

  const handleChange = (data: string | undefined) => {
    setTaskDescription(data)
  }
  const handleClickSave = () => {
    updateTaskDescription(data?.id, taskDescription)
    setIsShowMarkdownDescription(false)
  }
  const handleClickCancel = () => {
    setIsShowMarkdownDescription(false)
    if (data) {
      setTaskDescription(data.description)
    }
  }

  const handleChangeComment = (data: string | undefined) => {
    setTaskComment(data)
  }
  const handleClickSaveComment = () => {
    if (data && taskComment !== '') {
      idCommentSelected
        ? updateComment({ id: data.id, commentId: idCommentSelected, content: taskComment })
        : postComment({
            id: data.id,
            comment: {
              content: taskComment,
              parentId: '',
            },
          })
    }
  }
  const handleClickCancelComment = () => {
    setIsShowMarkdownComment(false)
    setIsShowMarkdownPostComment(false)
    setTaskComment('')
  }

  const handleClickSaveReplyComment = () => {
    if (data && taskComment !== '') {
      postComment({
        id: data.id,
        comment: {
          content: taskComment,
          parentId: idCommentSelected,
        },
      })
    }
  }
  const handleClickCancelReplyComment = () => {
    setIsShowMarkdownReplyComment(false)
    setTaskComment('')
  }
  const handleReplyComment = (comment: CommentsTaskResponse) => {
    setIdCommentSelected(comment.id)
  }
  const handleEditComment = (comment: CommentsTaskResponse) => {
    setIdCommentSelected(comment.id)
  }
  const handleDeleteComment = (comment: CommentsTaskResponse | undefined) => {
    if (comment) {
      deleteComment({ id: comment.taskId, commentId: comment.id })
    }
  }

  const handleAddChecklist = () => {
    if (titleCheckList) {
      createCheckList({ id: task.id, name: titleCheckList })
    }
  }
  const handleAddItem = (checklist: CheckListTaskResponse) => {
    if (textCheckListItem) {
      createCheckListItem({ id: task.id, checkListId: checklist.id, content: textCheckListItem })
    }
  }
  function countIsDone(checklistItems: CheckListItemTaskResponse[]) {
    return checklistItems.reduce((totalIsDone: number, item: CheckListItemTaskResponse) => {
      if (item.isDone) {
        return totalIsDone + 1
      }
      return totalIsDone
    }, 0)
  }
  const handleChangeCheckbox = (
    checklistItem: CheckListItemTaskResponse,
    checklist: CheckListTaskResponse,
  ) => {
    updateStatusCheckListItem({
      id: task.id,
      checkListId: checklist.id,
      checkListItemId: checklistItem.id,
      status: !checklistItem.isDone,
    })
  }
  const handleEditTitleChecklist = (checklist: CheckListTaskResponse) => {
    if (textTitleCheckList !== checklist.name) {
      updateCheckList({ id: checklist.taskId, checkListId: checklist.id, name: textTitleCheckList })
    }
  }
  const handleDeleteCheckList = (checklist: CheckListTaskResponse | undefined) => {
    if (checklist) {
      deleteCheckList({ id: checklist.taskId, checkListId: checklist.id })
    }
  }
  const handleEditItemChecklist = (
    checklist: CheckListTaskResponse,
    checklistItems: CheckListItemTaskResponse,
  ) => {
    if (textCheckListItem !== checklistItems.content) {
      updateCheckListItem({
        id: checklist.taskId,
        checkListId: checklistItems.checkListId,
        checkListItemId: checklistItems.id,
        content: textCheckListItem,
      })
    }
  }
  const handleClickDeleteCheckListItem = (
    checklist: CheckListTaskResponse,
    checklistItems: CheckListItemTaskResponse,
  ) => {
    deleteCheckListItem({
      id: checklist.taskId,
      checkListId: checklistItems.checkListId,
      checkListItemId: checklistItems.id,
    })
  }

  useEffect(() => {
    if (isSuccessGetTask && taskInfo) {
      setTaskDescription(taskInfo.description)
    }
  }, [isSuccessGetTask])

  useEffect(() => {
    if (members && task.ownerId) {
      setFirstNameOwner(members?.filter((member) => member.id === task.ownerId)[0].firstName)
      setLastNameOwner(members?.filter((member) => member.id === task.ownerId)[0].lastName)
    }
  }, [task.ownerId])

  useEffect(() => {
    if (members && task.assigneeId) {
      setIdAssignee(members?.filter((member) => member.id === task.assigneeId)[0].id)
      setFirstNameAssignee(members?.filter((member) => member.id === task.assigneeId)[0].firstName)
      setLastNameAssignee(members?.filter((member) => member.id === task.assigneeId)[0].lastName)
    }
  }, [task.assigneeId])

  useEffect(() => {
    if (isSuccess === true) {
      refetch()
    }
  }, [isSuccess])

  useEffect(() => {
    if (resultDeleteAttachment.isSuccess) {
      setIsOpenDeleteAttachmentDialog(false)
      toast.success('Delete successfully!')
      refetch()
    }
  }, [resultDeleteAttachment.isSuccess])
  useEffect(() => {
    if (resultUpdateAttachment.isSuccess) {
      setIsOpenUpdateAttachmentDialog(false)
      toast.success('Update successfully!')
      refetch()
    }
  }, [resultUpdateAttachment.isSuccess])

  useEffect(() => {
    if (resultPostComment.isSuccess) {
      setIsShowMarkdownPostComment(false)
      setIsShowMarkdownReplyComment(false)
      setIdCommentSelected('')
      setTaskComment('')
      refetchComment()
      {
        isReplyCommentSelected && refetchReplyComment()
      }
    }
  }, [resultPostComment.isSuccess])

  useEffect(() => {
    if (resultUpdateComment.isSuccess) {
      setIsShowMarkdownComment(false)
      setIsShowMarkdownEditReplyComment(false)
      toast.success('Update successfully!')
      setIdCommentSelected('')
      setTaskComment('')
      refetchComment()
      {
        isReplyCommentSelected && refetchReplyComment()
      }
    }
  }, [resultUpdateComment.isSuccess])
  useEffect(() => {
    if (resultDeleteComment.isSuccess) {
      toast.success('Delete successfully!')
      refetchComment()
      {
        isCommentSelected?.parentCommentId !== null && refetchReplyComment()
      }
    }
  }, [resultDeleteComment.isSuccess])
  useEffect(() => {
    updateAssigneeUser(firstNameAssignee, lastNameAssignee)
  }, [firstNameAssignee, lastNameAssignee])

  useEffect(() => {
    setRealtimeComment(commentData)
  }, [isGetCommentDataSuccess])
  useEffect(() => {
    setRealtimeComment(commentData)
  }, [commentData])
  useEffect(() => {
    setRealtimeReplyComment(replyCommentData)
  }, [isSuccessReplyComment])
  useEffect(() => {
    setRealtimeReplyComment(replyCommentData)
  }, [replyCommentData])

  useEffect(() => {
    setRealtimeComment(commentData)
  }, [isGetCommentDataSuccess])
  useEffect(() => {
    setRealtimeComment(commentData)
  }, [commentData])
  useEffect(() => {
    if (!isInitSocket && auth.accessToken) {
      webSocketService = new WebSocketService()
      webSocketService.initSocket()
      webSocketService.updateToken(auth.accessToken)
      setIsInitSocket(true)
    }
  }, [isInitSocket])
  useEffect(() => {
    if (task.id) {
      const getWebsocketProjectsRespone = (value: TDataStageSocketRespone) => {
        switch (value.type) {
          case WEBSOCKER_UPDATED.TASK_ASSIGNED: {
            const { assigneeId } = value.data
            const assigneedUser = members?.find((member) => member.id === assigneeId)
            if (assigneedUser) {
              setFirstNameAssignee(assigneedUser.firstName)
              setLastNameAssignee(assigneedUser.lastName)
            }
            break
          }
          case WEBSOCKER_UPDATED.TASK_UNASSIGNED: {
            setFirstNameAssignee('')
            setLastNameAssignee('')
            break
          }
          case WEBSOCKER_UPDATED.TASK_UPDATED: {
            const title = value.data.title as string
            const description = value.data.description as string

            updateRealTimeTaskTitle(title)
            updateRealtimeTaskDesc(description)

            setTaskInfo((pre) => {
              const updatedTask = {
                ...pre,
                title: title,
                description: description,
              } as TaskResponse

              return updatedTask
            })
            break
          }
          default:
            break
        }
      }

      const listeners = [
        {
          topic: `/topic/tasks/${task.id}`,
          listener: WEBSOCKET_LISTENER.LISTENER_TASKS,
          callback: getWebsocketProjectsRespone,
        },
      ]
      webSocketService.onConnected(listeners)

      return () => {
        if (webSocketService.isStompConnected()) {
          listeners.forEach(({ topic }) => {
            webSocketService.unsubscribe(topic)
          })
          webSocketService.onDisconnect()
        }
      }
    }
  }, [task.id])
  useEffect(() => {
    if (taskInfo) setTaskDescription(taskInfo.description)
  }, [taskInfo?.description])

  useEffect(() => {
    if (isReplyCommentSelected?.id) {
      setSkipGetChildrenComment(false)
    }
  }, [isReplyCommentSelected])
  useEffect(() => {
    if (isSuccess) {
      setSkipGetChildrenComment(true)
    }
  }, [isSuccess])

  useEffect(() => {
    if (resultCreateCheckList.isSuccess) {
      setIsOpenTaskCheckListDialog(false)
      toast.success('Create checklist successfully!')
      refetchGetCheckList()
    }
  }, [resultCreateCheckList.isSuccess])
  useEffect(() => {
    if (resultUpdateCheckList.isSuccess) {
      refetchGetCheckList()
    }
  }, [resultUpdateCheckList.isSuccess])
  useEffect(() => {
    if (resultDeleteCheckList.isSuccess) {
      toast.success('Delete checklist successfully!')
      refetchGetCheckList()
    }
  }, [resultDeleteCheckList.isSuccess])
  useEffect(() => {
    if (resultCreateCheckListItem.isSuccess) {
      setIsAddNewItem(false)
      refetchGetCheckList()
    }
  }, [resultCreateCheckListItem.isSuccess])
  useEffect(() => {
    if (resultUpdateCheckListItem.isSuccess) {
      refetchGetCheckList()
    }
  }, [resultUpdateCheckListItem.isSuccess])
  useEffect(() => {
    if (resultDeleteCheckListItem.isSuccess) {
      toast.success('Delete successfully!')
      refetchGetCheckList()
    }
  }, [resultDeleteCheckListItem.isSuccess])
  useEffect(() => {
    if (resultUpdateStatusCheckListItem.isSuccess) {
      refetchGetCheckList()
    }
  }, [resultUpdateStatusCheckListItem.isSuccess])

  useEffect(() => {
    if (!isInitSocket && auth.accessToken) {
      webSocketService = new WebSocketService()
      webSocketService.initSocket()
      webSocketService.updateToken(auth.accessToken)
      setIsInitSocket(true)
    }
  }, [isInitSocket])
  useEffect(() => {
    if (realtimeComment && realtimeAddComment?.parentCommentId === null) {
      setRealtimeComment([...realtimeComment, realtimeAddComment])
    } else if (
      realtimeReplyComment &&
      realtimeAddComment &&
      isReplyCommentSelected?.parentCommentId === realtimeAddComment.parentCommentId
    ) {
      setRealtimeReplyComment([...realtimeReplyComment, realtimeAddComment])
    }
  }, [realtimeAddComment?.id])
  useEffect(() => {
    if (realtimeUpdateComment?.parentCommentId === null && realtimeComment) {
      const newProjects: CommentsTaskResponse[] = realtimeComment.map((p) => {
        if (p.id === realtimeUpdateComment?.id) {
          return { ...p, content: realtimeUpdateComment.content }
        }
        return { ...p }
      })
      setRealtimeComment(newProjects)
    } else if (realtimeReplyComment) {
      const newProjects: CommentsTaskResponse[] = realtimeReplyComment.map((p) => {
        if (p.id === realtimeUpdateComment?.id) {
          return { ...p, content: realtimeUpdateComment.content }
        }
        return { ...p }
      })
      setRealtimeReplyComment(newProjects)
    }
  }, [realtimeUpdateComment])
  useEffect(() => {
    if (realtimeCommentDelete?.parentCommentId === null) {
      setRealtimeComment(
        realtimeComment?.filter((comment) => comment.id !== realtimeCommentDelete?.id),
      )
    } else if (realtimeReplyComment) {
      setRealtimeReplyComment(
        realtimeReplyComment?.filter((comment) => comment.id !== realtimeCommentDelete?.id),
      )
    }
  }, [realtimeCommentDelete?.id])

  useEffect(() => {
    if (task.id) {
      const getWebsocketProjectsRespone = (value: TDataStageSocketRespone) => {
        switch (value.type) {
          case WEBSOCKER_UPDATED.TASK_ASSIGNED: {
            const { assigneeId } = value.data
            const assigneedUser = members?.find((member) => member.id === assigneeId)
            if (assigneedUser) {
              setFirstNameAssignee(assigneedUser.firstName)
              setLastNameAssignee(assigneedUser.lastName)
            }
            break
          }
          case WEBSOCKER_UPDATED.TASK_UNASSIGNED: {
            setFirstNameAssignee('')
            setLastNameAssignee('')
            break
          }
          case WEBSOCKER_UPDATED.TASK_UPDATED: {
            const title = value.data.title as string
            updateRealTimeTaskTitle(title)
            setTaskInfo((pre) => {
              const updatedTask = {
                ...pre,
                title: title,
              } as TaskResponse
              return updatedTask
            })
            break
          }
          case WEBSOCKER_UPDATED.COMMENT_ADDED: {
            const newComment = value.data as CommentsTaskRealtimeResponse
            setRealtimeAddComment(newComment)
            break
          }
          case WEBSOCKER_UPDATED.COMMENT_DELETED: {
            const commentDelete = value.data as CommentsTaskRealtimeResponse
            setRealtimeCommentDelete(commentDelete)
            if (commentDelete.parentCommentId !== null) {
              refetchComment()
            }
            break
          }
          case WEBSOCKER_UPDATED.COMMENT_UPDATED: {
            const updateComment = value.data as CommentsTaskRealtimeResponse
            setRealtimeUpdateComment(updateComment)
            if (updateComment.parentCommentId === null) {
              refetchComment()
            } else {
              refetchReplyComment()
            }
            break
          }
          case WEBSOCKER_UPDATED.COMMENT_REPLIED: {
            const replyComment = value.data as CommentsTaskRealtimeResponse
            setRealtimeAddComment(replyComment)
            refetchReplyComment()
            refetchComment()
            break
          }
          default:
            break
        }
      }

      const listeners = [
        {
          topic: `/topic/tasks/${task.id}`,
          listener: WEBSOCKET_LISTENER.LISTENER_TASKS,
          callback: getWebsocketProjectsRespone,
        },
      ]
      webSocketService.onConnected(listeners)

      return () => {
        if (webSocketService.isStompConnected()) {
          listeners.forEach(({ topic }) => {
            webSocketService.unsubscribe(topic)
          })
          webSocketService.onDisconnect()
        }
      }
    }
  }, [task.id])
  return (
    <Dialog
      disableEnforceFocus={true}
      open={isOpenTaskDialog}
      scroll="body"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        height: '100%',
        width: '100%',
        '& .MuiDialog-paper': {
          height: '85%',
          width: '100%',
          maxWidth: '800px',
        },
      }}
      onClose={() => setIsOpenTaskDialog(false)}
    >
      <DialogTitle id="alert-dialog-title" sx={{ paddingTop: '24px' }}>
        <Grid container spacing={2}>
          <Grid item xs={0.8} sx={{ marginTop: '5px' }}>
            <CreditScoreOutlined />
          </Grid>
          <Grid item xs={9.8} sx={{ paddingLeft: '10px!important' }}>
            <TaskTitleDialog
              dataTask={taskInfo}
              editModeTitle={editModeTitle}
              updateTaskTitle={updateTaskTitle}
              onEditModeTitle={setEditModeTitle}
            />
            <DialogContentText>
              in list{' '}
              <span style={{ textDecoration: 'underline', textTransform: 'uppercase' }}>
                {stageName}
              </span>
            </DialogContentText>
          </Grid>
          <Grid item xs={1.4}>
            <Button
              sx={{
                color: 'black',
                ':hover': {
                  background: 'transparent',
                },
              }}
              onClick={() => setIsOpenTaskDialog(false)}
            >
              <CloseOutlined
                sx={{
                  height: '28px',
                  width: '28px',
                  borderRadius: '100%',
                  ':hover': {
                    background: '#bababacf',
                  },
                }}
              />
            </Button>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              <Grid item xs={1}></Grid>
              <div>
                <p style={{ margin: 0, marginBottom: '3px', fontSize: '14px' }}>Owner</p>
                <FallbackAvatars
                  key={task.ownerId}
                  firstName={firstNameOwner}
                  lastName={lastNameOwner}
                  border="none"
                  tooltip={true}
                />
              </div>
              <div style={{ marginLeft: '1.5rem' }}>
                <p style={{ margin: 0, marginBottom: '3px', fontSize: '14px' }}>Assignee</p>
                <Button
                  sx={{
                    padding: 0,
                    ':hover': { background: 'transparent' },
                  }}
                  onClick={() => setIsOpenTaskAddAssigneeDialog(true)}
                >
                  <FallbackAvatars
                    key={idAssignee}
                    firstName={firstNameAssignee}
                    lastName={lastNameAssignee}
                    border="none"
                    tooltip={true}
                  />
                </Button>
                <TaskAddAssigneeDialog
                  isOpenTaskAddAssigneeDialog={isOpenTaskAddAssigneeDialog}
                  setIsOpenTaskAddAssigneeDialog={setIsOpenTaskAddAssigneeDialog}
                  members={members}
                  taskId={task.id}
                  idAssignee={idAssignee}
                  setIdAssignee={setIdAssignee}
                  setFirstNameAssignee={setFirstNameAssignee}
                  setLastNameAssignee={setLastNameAssignee}
                />
              </div>
            </div>
            <Grid container spacing={2} sx={{ paddingTop: '1rem' }}>
              <Grid item xs={1}>
                <DescriptionOutlined sx={{ marginRight: '1rem' }} />
              </Grid>
              <Grid item xs={11} sx={{ paddingLeft: '10px!important', position: 'relative' }}>
                <strong>Description</strong>
                <div>
                  {!isShowMarkdownDescription ? (
                    taskDescription ? (
                      <>
                        <Button
                          variant="contained"
                          sx={{
                            position: 'absolute',
                            top: '1rem',
                            right: '0',
                            float: 'right',
                            padding: '4px',
                            textTransform: 'initial',
                            color: '#000',
                            background: '#d5d5d59c',
                            ':hover': { background: '#bababacf' },
                          }}
                          onClick={() => setIsShowMarkdownDescription(true)}
                        >
                          Edit
                        </Button>
                        <Box
                          role="presentation"
                          dangerouslySetInnerHTML={{
                            __html: JSON.stringify(taskDescription).replace(/\\/g, '').slice(1, -1),
                          }}
                          sx={{
                            height: '100%',
                            width: '100%',
                            fontSize: '0.9rem',
                            marginTop: '1rem',
                            '& figure': {
                              margin: 0,
                            },
                            '& img': {
                              height: '100%',
                              width: '100%',
                              objectFit: 'cover',
                              '&:hover': {
                                cursor: 'pointer',
                              },
                            },
                            '& h2': {
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            },
                          }}
                          onClick={() => setIsShowMarkdownDescription(true)}
                          onKeyDown={() => setIsShowMarkdownDescription(true)}
                        ></Box>
                      </>
                    ) : (
                      <>
                        <p
                          role="presentation"
                          style={{
                            height: '70px',
                            width: '100%',
                            padding: '0.5rem',
                            background: '#e5e5e5',
                            borderRadius: '5px',
                            fontSize: '0.9rem',
                          }}
                          onClick={() => setIsShowMarkdownDescription(true)}
                          onKeyDown={() => setIsShowMarkdownDescription(true)}
                        >
                          Add a more detailed description...
                        </p>
                      </>
                    )
                  ) : (
                    ''
                  )}
                </div>
                {isShowMarkdownDescription && taskInfo && (
                  <TaskMarkdown
                    contentMarkdown={taskInfo.description}
                    handleChange={handleChange}
                    handleClickSave={handleClickSave}
                    handleClickCancel={handleClickCancel}
                    data={taskInfo}
                    refetch={() => refetch()}
                  />
                )}
              </Grid>
            </Grid>
            {taskInfo?.attachments && taskInfo.attachments.length > 0 && (
              <TaskAttachment
                setIsOpenTaskAttachmentDialog={setIsOpenTaskAttachmentDialog}
                isOpenDeleteAttachmentDialog={isOpenDeleteAttachmentDialog}
                setIsOpenDeleteAttachmentDialog={setIsOpenDeleteAttachmentDialog}
                isOpenUpdateAttachmentDialog={isOpenUpdateAttachmentDialog}
                setIsOpenUpdateAttachmentDialog={setIsOpenUpdateAttachmentDialog}
                setIsNameAttachmentUpadte={setIsNameAttachmentUpadte}
                data={taskInfo}
                handleDeleteAttachment={handleDeleteAttachment}
                handleUpdateAttachment={handleUpdateAttachment}
                handleAgreeDelete={handleAgreeDelete}
                handleUpdate={handleUpdate}
                resultUpdateAttachmentLoading={resultUpdateAttachment.isLoading}
              />
            )}
            {dataGetCheckList && (
              <TaskCheckList
                dataGetCheckList={dataGetCheckList}
                checklistSelect={checklistSelect}
                setChecklistSelect={setChecklistSelect}
                checklistItemSelect={checklistItemSelect}
                setChecklistItemSelect={setChecklistItemSelect}
                handleAddItem={handleAddItem}
                setTextCheckListItem={setTextCheckListItem}
                isAddNewItem={isAddNewItem}
                setIsAddNewItem={setIsAddNewItem}
                handleChangeCheckbox={handleChangeCheckbox}
                countIsDone={countIsDone}
                setTextTitleCheckList={setTextTitleCheckList}
                handleEditTitleChecklist={handleEditTitleChecklist}
                handleDeleteCheckList={handleDeleteCheckList}
                handleEditItemChecklist={handleEditItemChecklist}
                handleClickDeleteCheckListItem={handleClickDeleteCheckListItem}
                refetchGetCheckList={() => refetchGetCheckList()}
              />
            )}
            <Grid container spacing={2} sx={{ paddingTop: '2rem' }}>
              <Grid item xs={1}>
                <ChatOutlined sx={{ marginRight: '1rem' }} />
              </Grid>
              <Grid item xs={11} sx={{ paddingLeft: '10px!important', position: 'relative' }}>
                <strong>Comment</strong>
              </Grid>
            </Grid>
            {realtimeComment && (
              <TaskShowComment
                commentData={realtimeComment}
                data={taskInfo}
                handleChangeComment={handleChangeComment}
                handleClickSaveComment={handleClickSaveComment}
                handleClickCancelComment={handleClickCancelComment}
                handleClickSaveReplyComment={handleClickSaveReplyComment}
                handleClickCancelReplyComment={handleClickCancelReplyComment}
                handleReplyComment={handleReplyComment}
                handleEditComment={handleEditComment}
                handleDeleteComment={handleDeleteComment}
                refetch={() => refetch()}
                isShowMarkdownComment={isShowMarkdownComment}
                setIsShowMarkdownComment={setIsShowMarkdownComment}
                isShowMarkdownReplyComment={isShowMarkdownReplyComment}
                setIsShowMarkdownReplyComment={setIsShowMarkdownReplyComment}
                setIsShowMarkdownPostComment={setIsShowMarkdownPostComment}
                isShowMarkdownEditReplyComment={isShowMarkdownEditReplyComment}
                setIsShowMarkdownEditReplyComment={setIsShowMarkdownEditReplyComment}
                resultDeleteCommentSuccess={resultDeleteComment.isSuccess}
                resultDeleteCommentLoading={resultDeleteComment.isLoading}
                auth={auth}
                replyCommentData={realtimeReplyComment}
                isLoadingReplyComment={isLoadingReplyComment}
                isSuccessReplyComment={isSuccessReplyComment}
                refetchReplyComment={refetchReplyComment}
                isReplyCommentSelected={isReplyCommentSelected}
                setIsReplyCommentSelected={setIsReplyCommentSelected}
                setIdCommentSelected={setIdCommentSelected}
                isCommentSelected={isCommentSelected}
                setIsCommentSelected={setIsCommentSelected}
                isLoadingPostComment={resultPostComment.isLoading}
                isLoadingUpdateComment={resultUpdateComment.isLoading}
              />
            )}
            <Grid container spacing={2} sx={{ paddingTop: '1rem' }}>
              <Grid item xs={1}>
                {auth.firstName && auth.lastName && (
                  <FallbackAvatars
                    key={auth.username}
                    firstName={auth.firstName}
                    lastName={auth.lastName}
                    border="none"
                    tooltip={true}
                  />
                )}
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  '& .MuiBox-root': { marginTop: 0 },
                  '& .MuiDialogActions-root': { paddingBottom: 0 },
                }}
              >
                {isShowMarkdownPostComment && taskInfo ? (
                  <TaskMarkdown
                    handleChange={handleChangeComment}
                    handleClickSave={handleClickSaveComment}
                    handleClickCancel={handleClickCancelComment}
                    data={taskInfo}
                    refetch={() => refetch()}
                    isLoadingPostComment={resultPostComment.isLoading}
                    isLoadingUpdateComment={resultUpdateComment.isLoading}
                  />
                ) : (
                  <p
                    role="presentation"
                    style={{
                      width: '100%',
                      margin: '0',
                      padding: '0.5rem',
                      background: '#bababacf',
                      borderRadius: '5px',
                      fontSize: '0.9rem',
                    }}
                    onClick={() => {
                      setIsShowMarkdownPostComment(true)
                      setIsShowMarkdownComment(false)
                      setIdCommentSelected('')
                    }}
                    onKeyDown={() => setIsShowMarkdownPostComment(true)}
                  >
                    Write a comment...
                  </p>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sx={{ paddingLeft: '1.5rem!important' }}>
            <DialogContentText sx={{ paddingBottom: '0.5rem' }}>Add to task</DialogContentText>
            <Button
              variant="contained"
              sx={{
                width: '100%',
                marginBottom: '0.8rem',
                textTransform: 'initial',
                color: '#000',
                background: '#d5d5d59c',
                ':hover': { background: '#bababacf' },
              }}
            >
              <LabelOutlined sx={{ height: '1.2rem', width: '1.2rem', marginRight: '0.5rem' }} />
              Labels
            </Button>
            <Button
              variant="contained"
              sx={{
                width: '100%',
                marginBottom: '0.8rem',
                textTransform: 'initial',
                color: '#000',
                background: '#d5d5d59c',
                ':hover': { background: '#bababacf' },
              }}
              onClick={() => setIsOpenTaskCheckListDialog(true)}
            >
              <CheckBoxOutlined sx={{ height: '1.2rem', width: '1.2rem', marginRight: '0.5rem' }} />
              Checklist
            </Button>
            <TaskChecklistDialog
              isOpenTaskCheckListDialog={isOpenTaskCheckListDialog}
              setIsOpenTaskCheckListDialog={setIsOpenTaskCheckListDialog}
              setTitleCheckList={setTitleCheckList}
              handleAddChecklist={handleAddChecklist}
            />
            <Button
              variant="contained"
              sx={{
                width: '100%',
                marginBottom: '0.8rem',
                textTransform: 'initial',
                color: '#000',
                background: '#d5d5d59c',
                ':hover': { background: '#bababacf' },
              }}
              onClick={() => setIsOpenTaskAttachmentDialog(true)}
            >
              <AttachmentOutlined
                sx={{ height: '1.2rem', width: '1.2rem', marginRight: '0.5rem' }}
              />
              Attachment
            </Button>
            <TaskAttachmentDialog
              isOpenTaskAttachmentDialog={isOpenTaskAttachmentDialog}
              setIsOpenTaskAttachmentDialog={setIsOpenTaskAttachmentDialog}
              taskId={task.id}
              refetch={() => refetch()}
            />

            <DialogContentText sx={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
              Actions
            </DialogContentText>
            <Button
              variant="contained"
              sx={{
                width: '100%',
                marginBottom: '0.8rem',
                textTransform: 'initial',
                color: '#000',
                background: '#d5d5d59c',
                ':hover': { background: '#bababacf' },
              }}
              onClick={() => {
                if (onOpenMoveTaskForm) {
                  onOpenMoveTaskForm(task)
                }
              }}
            >
              <ArrowRightAltOutlined
                sx={{ height: '1.2rem', width: '1.2rem', marginRight: '0.5rem' }}
              />
              Move
            </Button>
            <Button
              variant="contained"
              sx={{
                width: '100%',
                marginBottom: '0.8rem',
                textTransform: 'initial',
                color: '#000',
                background: '#d5d5d59c',
                ':hover': { background: '#bababacf' },
              }}
              onClick={() => setIsOpenDeleteTaskDialog(true)}
            >
              <CheckBoxOutlined sx={{ height: '1.2rem', width: '1.2rem', marginRight: '0.5rem' }} />
              Archive
            </Button>
            <AlertDialog
              isOpen={isOpenDeleteTaskDialog}
              title="Warning!"
              dialogContent="Are you sure you want to delete it, this action cannot be undone"
              onAfterCloseDialog={onAfterCloseDialog}
              onAfterConfirm={onAfterConfirm}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
