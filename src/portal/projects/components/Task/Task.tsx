import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import SubjectIcon from '@mui/icons-material/Subject'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { useUpdateTaskMutation } from '@/store/task/taskApi'
import { IProjectMembers, TStage, TTaskResponse } from '@/types/project/projectResponse'

// eslint-disable-next-line import/namespace
import TaskDialog from './TaskDialog'
import TaskMenuButton from './TaskMenuButton'

interface IProps {
  task: TTaskResponse
  deleteTask: (taskId: string) => void
  onOpenMoveTaskForm?: (task: TTaskResponse) => void
  stage?: TStage
  members: IProjectMembers[] | undefined
  refetchTasks: () => void
}
type TOption = {
  title: string
  iconLeft?: React.ReactNode
  onClick?: () => void
}

export type TOptions = TOption[]
const Task = ({ task, deleteTask, onOpenMoveTaskForm, stage, members, refetchTasks }: IProps) => {
  const [assigneeIdUser, setAssigneeIdUser] = useState<string>(task.assigneeId)
  const [isIdTaskSelect, setIsIdTaskSelect] = useState<string>()
  const [taskTitle, setTaskTitle] = useState<string>(task.title)
  const [taskDescription, setTaskDescription] = useState<string>('')

  const [assigneeUser, setAssigneeUser] = useState<
    { firstName: string; lastName: string } | undefined
  >()
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const options: TOptions = [
    {
      title: 'Open',
      iconLeft: <CreditCardIcon fontSize="small" />,
      onClick: () => {
        setIsOpenTaskDialog(true), setMouseIsOver(false)
      },
    },
    {
      title: 'Move',
      iconLeft: <TrendingFlatIcon fontSize="small" />,
      onClick: () => {
        if (onOpenMoveTaskForm) {
          onOpenMoveTaskForm(task)
        }
        setMouseIsOver(false)
      },
    },
    {
      title: 'Delete',
      iconLeft: <DeleteForeverIcon fontSize="small" />,
    },
  ]
  useEffect(() => {
    setAssigneeIdUser(task.assigneeId)
  }, [task.assigneeId])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })
  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }
  const [isOpenTaskDialog, setIsOpenTaskDialog] = useState<boolean>(false)
  const [updateTask, resultUpdateTask] = useUpdateTaskMutation()

  function updateTaskTitle(taskId: string | undefined, name: string | undefined) {
    if (task.title !== name) {
      updateTask({
        id: taskId,
        task: [
          {
            op: 'replace',
            path: '/title',
            value: name,
          },
        ],
      })
    }
  }
  function updateTaskDescription(taskId: string | undefined, name: string | undefined) {
    if (name) setTaskDescription(name)
    updateTask({
      id: taskId,
      task: [
        {
          op: 'replace',
          path: '/description',
          value: name,
        },
      ],
    })
  }
  function updateRealTimeTaskTitle(newTitle: string) {
    setTaskTitle(newTitle)
  }

  function updateRealtimeTaskDesc(newDesc: string) {
    setTaskDescription(newDesc)
  }

  useEffect(() => {
    if (resultUpdateTask.isSuccess) {
      refetchTasks()
    }
  }, [resultUpdateTask.isSuccess])

  useEffect(() => {
    if (!mouseIsOver && !isOpenMenu) setIsShowMenu(false)
    if (!isOpenMenu) setIsShowMenu(false)
    if (mouseIsOver) setIsShowMenu(true)
  }, [mouseIsOver, isOpenMenu])

  useEffect(() => {
    if (assigneeIdUser && members) {
      const user = members.find((member) => member.id === assigneeIdUser)
      if (user) setAssigneeUser({ firstName: user.firstName, lastName: user.lastName })
    }
  }, [assigneeIdUser])

  const onToggleMenu = (isToggle: boolean) => {
    setIsOpenMenu(isToggle)
  }
  const onHiddenMenu = (isHidden: boolean) => {
    setMouseIsOver(!isHidden)
  }
  const updateAssigneeUser = (firstName: string, lastName: string) => {
    setAssigneeUser({ firstName: firstName, lastName: lastName })
  }

  return (
    <>
      <Box
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className=" flex flex-col gap-2 items-start p-2 overflow-x-hidden overflow-y-auto  mb-2 rounded-md text-left cursor-grab relative"
        sx={{
          height: 'auto',
          minHeight: 'auto',
          boxShadow: !isDragging ? 2 : 0,
          opacity: !isDragging ? 1 : 0.3,
          backgroundColor: '#ffffff',
        }}
        component="div"
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
        onClick={() => {
          setIsOpenTaskDialog(true)
          setIsIdTaskSelect(task.id)
        }}
      >
        <Box className="flex justify-around items-start">
          <Box component="div" sx={{ width: '80%' }}>
            <Typography>{taskTitle}</Typography>
          </Box>
          {isShowMenu && (
            <TaskMenuButton
              taskId={task.id}
              options={options}
              onToggleMenu={onToggleMenu}
              onDeleteTask={deleteTask}
              onHiddenMenu={onHiddenMenu}
            />
          )}
        </Box>
        <Box
          className="w-full"
          sx={{
            marginTop: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <SubjectIcon
            sx={{
              opacity: taskDescription === '' ? 0 : 1,
            }}
          />
          {assigneeUser &&
            assigneeUser.firstName.length > 0 &&
            assigneeUser.lastName.length > 0 && (
              <FallbackAvatars
                firstName={assigneeUser.firstName}
                lastName={assigneeUser.lastName}
                tooltip={true}
              />
            )}
        </Box>
      </Box>
      <TaskDialog
        updateRealTimeTaskTitle={updateRealTimeTaskTitle}
        updateAssigneeUser={updateAssigneeUser}
        isOpenTaskDialog={isOpenTaskDialog}
        setIsOpenTaskDialog={setIsOpenTaskDialog}
        task={task}
        isIdTaskSelect={isIdTaskSelect}
        stageName={stage?.name}
        updateTaskTitle={updateTaskTitle}
        updateTaskDescription={updateTaskDescription}
        members={members}
        isSuccess={resultUpdateTask.isSuccess}
        updateRealtimeTaskDesc={updateRealtimeTaskDesc}
        onOpenMoveTaskForm={onOpenMoveTaskForm}
        onDeleteTask={deleteTask}
      />
    </>
  )
}

export default Task
