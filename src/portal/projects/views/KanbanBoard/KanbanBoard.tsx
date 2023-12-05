import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

// eslint-disable-next-line import/namespace
import WebSocketService from '@/portal/services/webSocketServices'
import { useAuth } from '@/store/auth/useAuth'
import {
  // eslint-disable-next-line import/namespace
  useAddNewTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useUpdateBatchTaskMutation,
  useUpdateStageMutation,
} from '@/store/project/projectApi'
import {
  DESCRIPTION_NO_MORE_THAN_60_CHAR,
  MESSAGE_DO_NOT_HAVE_ACCESS_THIS_RESOURCE,
  MESSAGE_STAGE_NAME_DUPLICATE,
  NOT_ALLOWING_WHITESPACE,
  REGEX_CHECK_WHITESPACE,
} from '@/types/project/constants'
import { EDraggingDroppingType, EMoveTaskPosition } from '@/types/project/projectEnum'
import {
  TTaskBehindActiveTaskUpdated,
  TTaskInFormOfActiveTaskUpdated,
  TTaskRequest,
} from '@/types/project/projectRequest'
import {
  EmessageResponse,
  IDataResponse,
  IProjectMembers,
  IProjectStatesRespones,
  TStage,
  TTaskResponse,
  TypeOfMessageResponse,
} from '@/types/project/projectResponse'
// eslint-disable-next-line import/namespace
import { WEBSOCKER_UPDATED, WEBSOCKET_LISTENER } from '@/types/socket/socketEnum'
import { TDataStageSocketRespone, TTaskSocketRespone } from '@/types/socket/socketResponse'

import AlertDialog from '../../../components/Dialogs/AlertDialog'
import Stage from '../../components/Stage/Stage'
import TaskCard from '../../components/Task/Task'
// eslint-disable-next-line import/namespace
import TaskMoveForm from '../../components/Task/TaskMoveForm'
import {
  groupTasksByStageId,
  mapOrder,
  moveObjectInArray,
  sortTasksByNextAndPrevious,
  updatedTaskResquestPosition,
} from '../../services/draggingDroppingTaskServices'
import {
  moveTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks,
  moveTheTaskAtTheBegginngTaskInTheEndToTheBottomStage,
  moveTheTaskAtTheEndHasATaskInFrontOfItIsTheFirstTaskToTheTopStage,
  moveTheTaskAtTheEndHasATaskInFrontOfItNotTheFirstTaskToTheTopStage,
  moveTheTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks,
  moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasNotTask,
  moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasTasks,
  moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasNotTasks,
  moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasTasks,
  moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasNotTask,
  moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasTasks,
  moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasNotTask,
  moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasTask,
  moveTheTaskHaveTaskInTheBeggningnAndTaskInTheBehind,
  moveTheTaskInThe2ndPositionToTheTopOfTheStage,
  moveTheTaskInThe3ndPositionToTheTopOfTheStage,
  moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasNotTask,
  moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasTasks,
  moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasNotTask,
  moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasTaskAtTheEnd,
  moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasNotTaskTheEnd,
  moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasTaskTheEnd,
  moveTheTaskOnTheTopHasTheBehindTaskIsTheEndTaskToTheBottomStage,
  moveTheTaskOnTheTopHasTheBehindTaskToTheBottomStage,
  moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasNotTask,
  moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasTasks,
  updateTasksAfterMoveTask,
} from '../../services/moveTaskServices'

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .matches(REGEX_CHECK_WHITESPACE, NOT_ALLOWING_WHITESPACE)
    .max(60, DESCRIPTION_NO_MORE_THAN_60_CHAR)
    .required(''),
})
interface IProps {
  projectStages: IProjectStatesRespones[]
  members: IProjectMembers[] | undefined
}
export interface IInititalValuesTask {
  stageIdNew: string
  position: EMoveTaskPosition
}

const KanbanBoard = ({ projectStages, members }: IProps) => {
  const { id } = useParams()
  const auth = useAuth()
  const [updateStage, resultUpdateStage] = useUpdateStageMutation()
  const [addNewTask, resultAddNewTask] = useAddNewTaskMutation()
  const [deleteTaskMutation, resultDeleteTaskMutation] = useDeleteTaskMutation()
  const [updateBatchTask, resultsUpdateBatchTask] = useUpdateBatchTaskMutation()
  const tasksData = useGetTasksQuery({ id: String(id) })

  const [taskIdForDelete, setTaskIdForDelete] = useState<string | null>(null)
  const [initNameStage] = useState<{ name: string }>({ name: '' })
  const [isExistStageName, setIsExistStageName] = useState<boolean | null>(null)
  const [isOpenInputAddStage, setIsOpenInputAddStage] = useState<boolean>(false)
  const [isOpenDialogConfirmDeleteStage, setIsOpenDialogConfirmDeleteStage] =
    useState<boolean>(false)
  const [removeStageId, setRemoveStageId] = useState<string>('')
  const [isCreateNewStage, setCreateNewStage] = useState<boolean>(false)
  const [isDeleteStage, setIsDeleteStage] = useState<boolean>(false)
  const [isMoveStage, setIsMoveStage] = useState<boolean>(false)
  const [isOpenTaskMoveForm, setIsOpenTaskMoveForm] = useState<boolean>(false)

  const [stages, setStages] = useState<TStage[]>(projectStages)
  const [tasks, setTasks] = useState<TTaskResponse[]>([])
  const [activeStage, setActiveStage] = useState<TStage | null>(null)
  const [overStageId, setOverStageId] = useState<string | null>(null)
  const [activeStageWillMove, setActiveStageWillMove] = useState<TStage | null>(null)
  const [activeTask, setActiveTask] = useState<TTaskResponse | null>(null)
  const [sortedTasks, setSortedTasks] = useState<TTaskResponse[]>([])
  const [overTask, setOverTask] = useState<TTaskResponse | null>(null)
  const [isInitSocket, setIsInitSocket] = useState(false)
  const [tasksSocketRespone, setTasksSocketRespone] = useState<TTaskSocketRespone[]>([])
  const [newTaskAddSocketRespone, setNewTaskAddSocketRespone] = useState<TTaskResponse | null>(null)
  let webSocketService
  useEffect(() => {
    const activeStage = stages.find((stage) => stage.id === activeTask?.stageId)
    if (activeStage) setActiveStageWillMove(activeStage)
  }, [activeTask])

  useEffect(() => {
    if (!isInitSocket && auth.accessToken) {
      webSocketService = new WebSocketService()
      webSocketService.initSocket()
      webSocketService.updateToken(auth.accessToken)
      setIsInitSocket(true)
    }
  }, [isInitSocket])

  useEffect(() => {
    if (auth.accessToken && isInitSocket) {
      webSocketService.updateToken(auth.accessToken)
    }
  }, [auth.accessToken])

  const initialValuesTaskMoveForm: IInititalValuesTask = {
    stageIdNew: activeStageWillMove ? activeStageWillMove.id : '',
    position: EMoveTaskPosition.MOVE_ON_THE_BEGINNING,
  }
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })
  const sensors = useSensors(pointerSensor)
  const stageIds = useMemo(() => stages.map((stage) => stage.id), [stages])
  const formik = useFormik({
    initialValues: initNameStage,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createNewStage(values)
    },
  })
  const errorResponse = { ...resultAddNewTask.error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const customMessages: TypeOfMessageResponse = {
    [EmessageResponse.doNotHaveAccessThisResource]: MESSAGE_DO_NOT_HAVE_ACCESS_THIS_RESOURCE,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''
  function onExistStageName(isExsit: boolean) {
    setIsExistStageName(isExsit)
  }
  function createNewStage(values: Record<string, string>) {
    if (id) {
      updateStage({
        projectId: id,
        stages: [...stages, { id: '', name: values.name }],
      })
      setCreateNewStage(true)
      return
    }
  }
  function openDialogConfirmRemoveStage(stageId: string) {
    setIsOpenDialogConfirmDeleteStage(true)
    setRemoveStageId(stageId)
  }
  function removeStage(stageId: string) {
    if (id && stageId) {
      const arrayAfterRemoveState = stages.filter((state) => state.id != stageId)
      updateStage({
        projectId: id,
        stages: [...arrayAfterRemoveState],
      })
    }
  }
  function onDragStart(event: DragStartEvent) {
    switch (event.active?.data?.current?.type) {
      case EDraggingDroppingType.STAGE:
        setActiveStage(event.active.data.current.stage)
        break
      case EDraggingDroppingType.TASK:
        setActiveTask(event.active.data.current.task)
        break
      default:
        break
    }
  }
  function onDragOver(event: DragEndEvent) {
    const { active, over } = event

    if (!active || !over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return
    if (activeId !== overId) {
      if (!over.data.current?.task) setOverStageId(String(overId))
      else {
        setOverTask(over.data.current?.task), setOverStageId(over.data.current?.task.stageId)
      }
    }

    const isActiveATask = active.data.current?.type === EDraggingDroppingType.TASK
    const isOverATask = over.data.current?.type === EDraggingDroppingType.TASK

    if (!isActiveATask) return

    if (isActiveATask && isOverATask) {
      setSortedTasks((tasks) => {
        const cloneTasks = [...tasks]
        const activeIndex = cloneTasks.findIndex((t) => t.id === activeId)
        const overIndex = cloneTasks.findIndex((t) => t.id === overId)
        const overTasks = cloneTasks.filter(
          (task) => task.stageId === cloneTasks[overIndex].stageId,
        )

        let newIndex: number
        const taskIds = cloneTasks.map((task) => task.id)
        if (overId in taskIds) {
          newIndex = overTasks.length + 1
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height

          const modifier = isBelowOverItem ? 1 : 0

          newIndex = overIndex >= 0 ? overIndex + modifier : overTasks.length + 1
        }

        if (cloneTasks[activeIndex].stageId != cloneTasks[overIndex].stageId) {
          const updatedTask = { ...cloneTasks[activeIndex] }

          updatedTask.stageId = cloneTasks[overIndex].stageId
          cloneTasks[activeIndex] = updatedTask
          let position = newIndex - 1
          if (position === -1) position = 0

          const movedTasks = moveObjectInArray(cloneTasks, String(activeId), position)
          return movedTasks
        }

        const movedTasks = moveObjectInArray(cloneTasks, String(activeId), newIndex)
        return movedTasks
      })
    }

    const isOverAColumn = over.data.current?.type === EDraggingDroppingType.STAGE

    if (isActiveATask && isOverAColumn) {
      setSortedTasks((tasks) => {
        const cloneTasks = [...tasks]
        const activeIndex = cloneTasks.findIndex((t) => t.id === activeId)
        const updatedTask: TTaskResponse = { ...cloneTasks[activeIndex] }

        updatedTask.stageId = String(overId)
        cloneTasks[activeIndex] = updatedTask

        return arrayMove(cloneTasks, activeIndex, activeIndex)
      })
    }
  }
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!active || !over) return
    const activeId = active.id
    const overId = over.id
    if (overId === null) {
      setActiveTask(null)
      return
    }
    if (active.data.current?.type === EDraggingDroppingType.TASK) {
      const activeStage = activeTask?.stageId
      const orderArray = active.data.current.sortable.items
      const tasksOfActiveStage = sortedTasks.filter((tsk) => tsk.stageId === activeStage)

      if (activeStage !== overStageId && overStageId) {
        let tasksOfOverStage = [] as TTaskResponse[]
        if (overStageId && !overTask?.stageId) {
          tasksOfOverStage = sortedTasks.filter((task) => task.stageId === overStageId)
        }
        if (!overStageId && overTask?.stageId) {
          tasksOfOverStage = sortedTasks.filter((task) => task.stageId === overTask?.stageId)
        }
        if (overStageId && overTask?.stageId) {
          tasksOfOverStage = sortedTasks.filter((task) => task.stageId === overStageId)
        }
        const orderTaskActiveStage = tasksOfActiveStage.map((task) => task.id)
        const orderTaskOverStage = tasksOfOverStage.map((task) => task.id)
        const updatedTaskOfActiveStage = mapOrder(tasksOfActiveStage, orderTaskActiveStage)
        const updatedTaskOfOverStage = mapOrder(tasksOfOverStage, orderTaskOverStage)
        const tasksUpdated = updatedTaskResquestPosition([
          ...updatedTaskOfActiveStage,
          ...updatedTaskOfOverStage,
        ])

        const tasksForDisplay = sortedTasks.map((oldTask) => {
          const newTask = tasksUpdated.find((newTask) => newTask.id === oldTask.id)
          return newTask
            ? {
                ...oldTask,
                stageId: newTask.stageId,
                nextId: newTask.nextTaskId,
                previousId: newTask.preTaskId,
              }
            : oldTask
        }) as TTaskResponse[]
        updateBatchTask(tasksUpdated)

        setTasks(tasksForDisplay)
      }
      if (activeStage === overStageId || !overStageId) {
        const updatedTaskOfStage = mapOrder(tasksOfActiveStage, orderArray)
        const tasksUpdated = updatedTaskResquestPosition(updatedTaskOfStage)
        const tasksForDisplay = sortedTasks.map((oldTask) => {
          const newTask = tasksUpdated.find((newTask) => newTask.id === oldTask.id)
          return newTask
            ? {
                ...oldTask,
                nextId: newTask.nextTaskId,
                previousId: newTask.preTaskId,
              }
            : oldTask
        }) as TTaskResponse[]
        updateBatchTask(tasksUpdated)
        setTasks(tasksForDisplay)
      }
      setActiveStage(null)
      setActiveTask(null)
      setOverStageId(null)
      setOverTask(null)
      return
    }
    setActiveStage(null)
    setActiveTask(null)
    setOverStageId(null)
    setOverTask(null)
    if (active.data.current?.type === EDraggingDroppingType.STAGE && activeId !== overId) {
      setStages((stages) => {
        const activeStageIndex = stages.findIndex((stage: TStage) => stage.id === activeId)
        const overStageIndex = stages.findIndex((stage: TStage) => stage.id === overId)
        return arrayMove(stages, activeStageIndex, overStageIndex)
      })
      setIsMoveStage(true)
    }
  }
  function updateNameStage(stageId: string, name: string) {
    if (id) {
      const newStages = stages.map((stage) => {
        if (stage.id !== stageId) return stage
        return { ...stage, name }
      })
      updateStage({
        projectId: id,
        stages: [...newStages],
      })
    }
  }
  function deleteTask(taskId: string) {
    setTaskIdForDelete(taskId)
    deleteTaskMutation(taskId)
  }
  function createTask(task: TTaskRequest) {
    addNewTask(task)
  }
  function filterTaskByStage(tasks: TTaskResponse[], stageId: string) {
    const taskFiltered = tasks.filter((task) => task.stageId === stageId)
    return taskFiltered
  }
  function closeMoveTaskForm() {
    setActiveTask(null)
    setActiveStageWillMove(null)
    setIsOpenTaskMoveForm(false)
  }
  function onOpenMoveTaskForm(task: TTaskResponse) {
    setActiveTask(task)
    setIsOpenTaskMoveForm(true)
  }
  function onSubmitMoveTask(values: IInititalValuesTask) {
    const { stageIdNew, position } = values
    if (activeTask) {
      const taskInFormOfActiveTask: TTaskResponse | undefined = tasks.find(
        (tsk: TTaskResponse) => tsk.id === activeTask.previousId,
      )
      const taskBehindActiveTask: TTaskResponse | undefined = tasks.find(
        (tsk: TTaskResponse) => tsk.id === activeTask.nextId,
      )
      const taskAtTheBiginning = tasks
        .filter((tsk: TTaskResponse) => tsk.stageId === stageIdNew)
        .filter((tsk: TTaskResponse) => tsk.previousId === null || tsk.previousId === undefined)[0]
      const taskAtTheEnd = tasks
        .filter((tsk: TTaskResponse) => tsk.stageId === stageIdNew)
        .filter((tsk: TTaskResponse) => tsk.nextId === null || tsk.nextId === undefined)[0]
      if (activeTask.stageId === stageIdNew) {
        switch (position) {
          case EMoveTaskPosition.MOVE_ON_THE_BEGINNING:
            // eslint-disable-next-line no-case-declarations
            if (taskAtTheBiginning.id === activeTask.id && taskInFormOfActiveTask === undefined) {
              closeMoveTaskForm()
            } else {
              let tasksUpdated

              const activeTaskUpdated: TTaskResponse = {
                ...activeTask,
                previousId: null,
                nextId: taskAtTheBiginning.id,
              }
              const taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated = {
                ...taskInFormOfActiveTask,
                nextId: taskBehindActiveTask?.id,
              }
              const taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated = {
                ...taskBehindActiveTask,
                previousId: taskInFormOfActiveTask?.id,
              }
              const taskAtBeginningUpdated: TTaskResponse = {
                ...taskAtTheBiginning,
                previousId: activeTaskUpdated.id,
              }
              if (
                taskAtTheEnd &&
                taskAtBeginningUpdated.id === taskInFormOfActiveTaskUpdated.id &&
                activeTask.id !== taskAtTheEnd.id
              ) {
                taskInFormOfActiveTaskUpdated.previousId = activeTaskUpdated.id
                const tasksRequestUpdatePositionNew = moveTheTaskInThe2ndPositionToTheTopOfTheStage(
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                )
                const newTasks = [
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
              if (
                taskAtBeginningUpdated.id !== taskInFormOfActiveTaskUpdated.id &&
                taskAtTheEnd.id !== activeTaskUpdated.id
              ) {
                const tasksRequestUpdatePositionNew = moveTheTaskInThe3ndPositionToTheTopOfTheStage(
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                  taskAtBeginningUpdated,
                )
                const newTasks = [
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                  taskAtBeginningUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
              if (
                taskInFormOfActiveTask &&
                taskAtTheEnd &&
                taskAtTheEnd.id === activeTaskUpdated.id &&
                taskAtTheBiginning.id !== taskInFormOfActiveTask.id
              ) {
                taskInFormOfActiveTaskUpdated.nextId = undefined
                const tasksRequestUpdatePositionNew =
                  moveTheTaskAtTheEndHasATaskInFrontOfItNotTheFirstTaskToTheTopStage(
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskAtBeginningUpdated,
                  )
                const newTasks = [
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskAtBeginningUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
              if (
                taskAtTheEnd &&
                taskInFormOfActiveTask &&
                activeTask.id === taskAtTheEnd.id &&
                taskInFormOfActiveTask.id === taskAtTheBiginning.id
              ) {
                taskInFormOfActiveTaskUpdated.nextId = undefined
                taskInFormOfActiveTaskUpdated.previousId = activeTask.id
                const tasksRequestUpdatePositionNew =
                  moveTheTaskAtTheEndHasATaskInFrontOfItIsTheFirstTaskToTheTopStage(
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                  )
                const newTasks = [activeTaskUpdated, taskInFormOfActiveTaskUpdated]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
            }
            break
          case EMoveTaskPosition.MOVE_ON_THE_END:
            // eslint-disable-next-line no-case-declarations
            if (
              taskAtTheEnd &&
              taskAtTheEnd.id === activeTask.id &&
              taskBehindActiveTask === undefined
            ) {
              closeMoveTaskForm()
            } else {
              let tasksUpdated
              const activeTaskUpdated: TTaskResponse = {
                ...activeTask,
                previousId: taskAtTheEnd.id,
                nextId: null,
              }
              const taskInFormOfActiveTaskUpdated = {
                ...taskInFormOfActiveTask,
                nextId: taskBehindActiveTask?.id,
              }
              const taskBehindActiveTaskUpdated = {
                ...taskBehindActiveTask,
                previousId: taskInFormOfActiveTask?.id,
              }

              const taskAtTheEndUpdated: TTaskResponse = {
                ...taskAtTheEnd,
                nextId: activeTaskUpdated.id,
              }
              if (
                taskAtTheEndUpdated.id === taskBehindActiveTaskUpdated.id &&
                taskAtTheBiginning.id !== activeTask.id
              ) {
                taskBehindActiveTaskUpdated.nextId = activeTaskUpdated.id
                const tasksRequestUpdatePositionNew =
                  moveTheTaskAtTheBegginngTaskInTheEndToTheBottomStage(
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                  )
                const newTasks = [
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
              if (
                taskAtTheEndUpdated.id !== taskBehindActiveTaskUpdated.id &&
                taskAtTheBiginning.id !== activeTaskUpdated.id
              ) {
                const tasksRequestUpdatePositionNew =
                  moveTheTaskHaveTaskInTheBeggningnAndTaskInTheBehind(
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  )
                const newTasks = [
                  activeTaskUpdated,
                  taskInFormOfActiveTaskUpdated,
                  taskBehindActiveTaskUpdated,
                  taskAtTheEndUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
              if (
                taskBehindActiveTask &&
                taskAtTheBiginning.id === activeTaskUpdated.id &&
                taskAtTheEnd.id !== taskBehindActiveTask.id
              ) {
                taskBehindActiveTaskUpdated.previousId = undefined
                const tasksRequestUpdatePositionNew =
                  moveTheTaskOnTheTopHasTheBehindTaskToTheBottomStage(
                    activeTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  )
                const newTasks = [
                  activeTaskUpdated,
                  taskBehindActiveTaskUpdated,
                  taskAtTheEndUpdated,
                ]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }

              if (
                taskBehindActiveTask &&
                taskAtTheBiginning.id === activeTask.id &&
                taskAtTheEnd.id === taskBehindActiveTask.id
              ) {
                taskAtTheEndUpdated.previousId = null
                const tasksRequestUpdatePositionNew =
                  moveTheTaskOnTheTopHasTheBehindTaskIsTheEndTaskToTheBottomStage(
                    activeTaskUpdated,
                    taskAtTheEndUpdated,
                  )
                const newTasks = [activeTaskUpdated, taskAtTheEndUpdated]
                updateBatchTask(tasksRequestUpdatePositionNew)
                tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                closeMoveTaskForm()
                setTasks(tasksUpdated)
              }
            }
            break
          default:
            break
        }
      }
      if (activeTask?.stageId !== stageIdNew) {
        const currentTaskAtTheBiginning = tasks
          .filter((tsk: TTaskResponse) => tsk.stageId === activeTask?.stageId)
          .filter((tsk: TTaskResponse) => tsk.previousId === null || undefined)[0]
        const currentTaskAtTheEnd = tasks
          .filter((tsk: TTaskResponse) => tsk.stageId === activeTask?.stageId)
          .filter((tsk: TTaskResponse) => tsk.nextId === null || undefined)[0]
        switch (position) {
          case EMoveTaskPosition.MOVE_ON_THE_BEGINNING:
            {
              // eslint-disable-next-line no-case-declarations
              const activeTaskUpdated = {
                ...activeTask,
                stageId: stageIdNew,
                previousId: null,
                nextId: taskAtTheBiginning && taskAtTheBiginning.id ? taskAtTheBiginning.id : null,
              }
              // eslint-disable-next-line no-case-declarations
              const taskAtTheBiginningUpdated = {
                ...taskAtTheBiginning,
                previousId: activeTaskUpdated.id,
              }
              if (
                activeTask &&
                activeTask.id === currentTaskAtTheBiginning.id &&
                taskBehindActiveTask
              ) {
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: null,
                }
                if (taskAtTheBiginning) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasTasks(
                      activeTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheBiginningUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheBiginningUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheBiginning === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasNotTask(
                      activeTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskBehindActiveTaskUpdated]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (
                taskBehindActiveTask &&
                taskInFormOfActiveTask &&
                taskInFormOfActiveTask.id === currentTaskAtTheBiginning.id
              ) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  previousId: null,
                  nextId: taskBehindActiveTask.id,
                }
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: taskInFormOfActiveTask.id,
                }
                if (taskAtTheBiginning) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasTasks(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheBiginningUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheBiginningUpdated,
                  ]

                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheBiginning === undefined) {
                  const tasksRequestUpdatePositionMew =
                    moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasNotTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionMew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (
                taskInFormOfActiveTask &&
                taskInFormOfActiveTask.id !== currentTaskAtTheBiginning.id &&
                taskBehindActiveTask
              ) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  nextId: taskBehindActiveTask.id,
                }
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: taskInFormOfActiveTask.id,
                }
                if (taskAtTheBiginning) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasNotTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheBiginningUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheBiginningUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheBiginning === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (taskInFormOfActiveTask && activeTask.id === currentTaskAtTheEnd.id) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  nextId: null,
                }
                if (taskAtTheBiginning) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasTasks(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskAtTheBiginningUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskAtTheBiginningUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheBiginning === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasNotTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskInFormOfActiveTaskUpdated]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (activeTask.nextId === null && activeTask.previousId === null) {
                if (taskAtTheBiginningUpdated.id) {
                  const tasksRequestUpdatePositionNew =
                    moveTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks(
                      activeTaskUpdated,
                      taskAtTheBiginningUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskAtTheBiginningUpdated]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheBiginning === undefined) {
                  updateBatchTask([
                    {
                      id: activeTaskUpdated.id,
                      stageId: activeTaskUpdated.stageId,
                      preTaskId: activeTaskUpdated.previousId,
                      nextTaskId: activeTaskUpdated.nextId,
                    },
                  ])
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, [activeTaskUpdated])
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
            }
            break
          case EMoveTaskPosition.MOVE_ON_THE_END:
            {
              // eslint-disable-next-line no-case-declarations
              const activeTaskUpdated = {
                ...activeTask,
                stageId: stageIdNew,
                previousId: taskAtTheEnd && taskAtTheEnd.id ? taskAtTheEnd.id : null,
                nextId: null,
              }
              // eslint-disable-next-line no-case-declarations
              const taskAtTheEndUpdated = {
                ...taskAtTheEnd,
                nextId: activeTaskUpdated.id,
              }
              if (
                activeTask &&
                activeTask.id === currentTaskAtTheBiginning.id &&
                taskBehindActiveTask
              ) {
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: null,
                }
                if (taskAtTheEnd) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasTaskTheEnd(
                      activeTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheEndUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheEnd === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasNotTaskTheEnd(
                      activeTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskBehindActiveTaskUpdated]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (
                taskBehindActiveTask &&
                taskInFormOfActiveTask &&
                taskInFormOfActiveTask.id === currentTaskAtTheBiginning.id
              ) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  previousId: null,
                  nextId: taskBehindActiveTask.id,
                }
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: taskInFormOfActiveTask.id,
                }
                if (taskAtTheEnd) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasTasks(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheEndUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheEnd === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasNotTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (
                taskInFormOfActiveTask &&
                taskInFormOfActiveTask.id !== currentTaskAtTheBiginning.id &&
                taskBehindActiveTask
              ) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  nextId: taskBehindActiveTask.id,
                }
                const taskBehindActiveTaskUpdated = {
                  ...taskBehindActiveTask,
                  previousId: taskInFormOfActiveTask.id,
                }
                if (taskAtTheEnd) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasTasks(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                      taskAtTheEndUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheEnd === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasNotTasks(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskBehindActiveTaskUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskBehindActiveTaskUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (taskInFormOfActiveTask && activeTask.id === currentTaskAtTheEnd.id) {
                const taskInFormOfActiveTaskUpdated = {
                  ...taskInFormOfActiveTask,
                  nextId: null,
                }
                if (taskAtTheEnd) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasTaskAtTheEnd(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                      taskAtTheEndUpdated,
                    )
                  const newTasks = [
                    activeTaskUpdated,
                    taskInFormOfActiveTaskUpdated,
                    taskAtTheEndUpdated,
                  ]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheEnd === undefined) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasNotTask(
                      activeTaskUpdated,
                      taskInFormOfActiveTaskUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskInFormOfActiveTaskUpdated]
                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
              if (activeTask.nextId === null && activeTask.previousId === null) {
                if (taskAtTheEndUpdated.id) {
                  const tasksRequestUpdatePositionNew =
                    moveTheTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks(
                      activeTaskUpdated,
                      taskAtTheEndUpdated,
                    )
                  const newTasks = [activeTaskUpdated, taskAtTheEndUpdated]

                  updateBatchTask(tasksRequestUpdatePositionNew)
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, newTasks)

                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
                if (taskAtTheEndUpdated.id === undefined) {
                  updateBatchTask([
                    {
                      id: activeTaskUpdated.id,
                      stageId: activeTaskUpdated.stageId,
                      preTaskId: activeTaskUpdated.previousId,
                      nextTaskId: activeTaskUpdated.nextId,
                    },
                  ])
                  const tasksUpdated = updateTasksAfterMoveTask(tasks, [activeTaskUpdated])
                  closeMoveTaskForm()
                  setTasks(tasksUpdated)
                }
              }
            }

            break
          default:
            break
        }
      }
    }
  }
  function refetchTasks() {
    tasksData.refetch()
  }
  useEffect(() => {
    if (resultUpdateStage.isSuccess) {
      formik.resetForm()
      setStages(resultUpdateStage.data)

      if (isDeleteStage) {
        toast.success('Delete stage successfully!')
        setIsDeleteStage(false)
        tasksData.refetch()
      }
      if (isCreateNewStage) {
        toast.success('Create new stage successfully!')
        setIsOpenInputAddStage(false)
        setIsExistStageName(false)
        setCreateNewStage(false)
      }
    }

    if (resultUpdateStage.isError) {
      const errorResponse = { ...resultUpdateStage.error } as IDataResponse
      const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null
      const customMessages: TypeOfMessageResponse = {
        [EmessageResponse.projectStageDuplicate]: MESSAGE_STAGE_NAME_DUPLICATE,
      }
      const messageErr = errorCode ? customMessages[errorCode] : ''
      setIsExistStageName(true)
      toast.error(messageErr)
    }
  }, [resultUpdateStage.isSuccess, resultUpdateStage.isError])

  useEffect(() => {
    if (isDeleteStage) {
      removeStage(removeStageId)
    }
  }, [isDeleteStage])

  useEffect(() => {
    if (isMoveStage && id) {
      updateStage({
        projectId: id,
        stages: [...stages],
      })
    }
    setIsMoveStage(false)
  }, [isMoveStage])

  useEffect(() => {
    if (messageErr != '') {
      toast.error(messageErr)
    }
  }, [messageErr])

  useEffect(() => {
    if (resultAddNewTask.isSuccess) {
      const responseData = resultAddNewTask.data

      if (responseData && tasks) {
        const updatedArray = tasks.map((task) => {
          const matchingObj = responseData.find((taskRes) => task.id === taskRes.id)
          return matchingObj ? { ...task, ...matchingObj } : task
        })
        responseData.forEach((newTask) => {
          if (!updatedArray.some((task) => task.id === newTask.id)) {
            updatedArray.push(newTask)
          }
        })
        setTasks(updatedArray)
      }
    }
  }, [resultAddNewTask.isSuccess])

  useEffect(() => {
    if (resultDeleteTaskMutation.data && tasks && taskIdForDelete) {
      if (resultDeleteTaskMutation.data.length === 0) {
        const deletedTasks = tasks.filter((task) => task.id !== taskIdForDelete)
        setTasks([...deletedTasks])
        return
      }
      const responseData = resultDeleteTaskMutation.data[0]
      const nextTaskId = responseData.nextId
      const previousTaskId = responseData.previousId
      const updateArray = [...tasks]
      if (responseData) {
        const deletedArray = updateArray.map((task) => {
          if (responseData.id === task.id) {
            return responseData
          }
          if (task.id === nextTaskId) {
            return {
              ...task,
              previousId: responseData.id,
            }
          }
          if (task.id === previousTaskId) {
            return {
              ...task,
              nextId: responseData.id,
            }
          }
          return task
        })
        const deletedTasks = deletedArray.filter((task) => task.id !== taskIdForDelete)
        setTasks(deletedTasks)
      }
    }
  }, [resultDeleteTaskMutation.isSuccess])

  useEffect(() => {
    if (resultDeleteTaskMutation.isError) {
      toast.error(MESSAGE_DO_NOT_HAVE_ACCESS_THIS_RESOURCE)
    }
  }, [resultDeleteTaskMutation.isError, resultDeleteTaskMutation.error])

  useEffect(() => {
    if (resultsUpdateBatchTask.isError) {
      toast.error(MESSAGE_DO_NOT_HAVE_ACCESS_THIS_RESOURCE)
    }
  }, [resultsUpdateBatchTask.isError])

  useEffect(() => {
    if (tasksData.isSuccess) {
      setTasks(tasksData.data)
    }
  }, [tasksData.data, tasksData.isSuccess])

  const updateTaskPositionSocketRespone = (
    tasks: TTaskSocketRespone[],
    newTask: TTaskResponse | null,
  ) => {
    const taskForDisplay = sortedTasks.map((oldTask) => {
      const currentTask = tasks.find((newTask) => newTask.id === oldTask.id)
      if (currentTask) {
        const updatedTask: TTaskResponse = {
          ...oldTask,
          nextId: currentTask.nextId,
          previousId: currentTask.previousId,
          stageId: currentTask.stageId,
        }
        return updatedTask
      } else {
        return oldTask
      }
    })
    if (newTask) {
      taskForDisplay.push(newTask)
    }

    return taskForDisplay
  }

  useEffect(() => {
    if (id) {
      const getWebsocketProjectsRespone = (value: TDataStageSocketRespone) => {
        switch (value.type) {
          case WEBSOCKER_UPDATED.STAGE_UPDATED: {
            const stages = value.data.stages as TStage[]
            setStages(stages)
            refetchTasks()
            break
          }
          case WEBSOCKER_UPDATED.TASK_POSITION_UPDATED: {
            const newTasks = value.data.tasks as TTaskSocketRespone[]
            setTasksSocketRespone(newTasks)
            break
          }
          case WEBSOCKER_UPDATED.TASK_ADDED: {
            // const newTask = value.data.task as TTaskResponse
            // const newTaskEffect = value.data.taskEffects as TTaskSocketRespone[]

            // setNewTaskAddSocketRespone(newTask)
            // setTasksSocketRespone(newTaskEffect)
            refetchTasks()

            break
          }
          case WEBSOCKER_UPDATED.TASK_DELETED: {
            const taskEffects = value.data.taskEffects as TTaskSocketRespone[]
            setTasksSocketRespone(taskEffects)
            refetchTasks()
            break
          }
          default:
            break
        }
      }

      const listeners = [
        {
          topic: `/topic/projects/${id}`,
          listener: WEBSOCKET_LISTENER.LISTENER_PROJECTS,
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
  }, [id])
  useEffect(() => {
    if (tasksSocketRespone.length > 0) {
      const taskForDisplay = updateTaskPositionSocketRespone(
        tasksSocketRespone,
        newTaskAddSocketRespone,
      ) as TTaskResponse[]

      setTasks(taskForDisplay)
      setNewTaskAddSocketRespone(null)
    }
  }, [tasksSocketRespone])
  useEffect(() => {
    const tasksOfStage = stages.map((stage) => {
      const tasksOfStage = tasks.filter((task) => task.stageId === stage.id)
      const taskssort = sortTasksByNextAndPrevious(tasksOfStage)
      return taskssort
    })
    const sortedTasksOfStage: TTaskResponse[] = groupTasksByStageId(tasksOfStage)

    setSortedTasks(sortedTasksOfStage)
  }, [tasks])

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      className="gap-4 pl-6 pr-6 relative flex-grow w-full overflow-auto"
    >
      <AlertDialog
        title="Warning!"
        dialogContent="Are you sure deleting this stage?"
        isOpen={isOpenDialogConfirmDeleteStage}
        onAfterCloseDialog={() => setIsOpenDialogConfirmDeleteStage(false)}
        onAfterConfirm={() => setIsDeleteStage(true)}
      />

      <TaskMoveForm
        title="Move task"
        initialValues={initialValuesTaskMoveForm}
        isOpen={isOpenTaskMoveForm}
        options={stages}
        onCloseMoveTaskForm={() => {
          setIsOpenTaskMoveForm(false)
          setActiveTask(null)
        }}
        onSubmit={onSubmitMoveTask}
      />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={stageIds} strategy={horizontalListSortingStrategy}>
          {' '}
          {stages?.map((stage) => (
            <Stage
              key={stage.id}
              isExistStageName={isExistStageName}
              isDisableDeleteStage={stages.length === 1}
              deleteTask={deleteTask}
              createTask={createTask}
              stage={stage}
              removeStage={openDialogConfirmRemoveStage}
              updateNameStage={updateNameStage}
              tasks={filterTaskByStage(sortedTasks, stage.id)}
              members={members}
              refetchTasks={refetchTasks}
              onOpenMoveTaskForm={onOpenMoveTaskForm}
              onExistStageName={onExistStageName}
            />
          ))}
        </SortableContext>
        <Box
          sx={{
            minWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F6EADE',
            width: '300px',
          }}
          className="mt-7 p-2 rounded-md "
        >
          {isOpenInputAddStage && (
            <ClickAwayListener onClickAway={() => setIsOpenInputAddStage(false)}>
              <Box
                noValidate
                className="w-full h-full relative"
                component="form"
                autoComplete="off"
                onSubmit={formik.handleSubmit}
              >
                <TextField
                  autoFocus
                  fullWidth
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={
                    formik.touched.name && Boolean(formik.errors.name) && (formik.errors.name ?? '')
                  }
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  placeholder="Add title for this task"
                  className="flex items-start p-2 overflow-x-hidden overflow-y-auto flex-col mb-2 rounded-md text-left w-full relative"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: '400',
                    boxShadow:
                      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                    backgroundColor: '#ffffff',
                  }}
                  id="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Box>
                  <Button type="submit" variant="contained" color="primary">
                    Add stage
                  </Button>
                </Box>
              </Box>
            </ClickAwayListener>
          )}
          {!isOpenInputAddStage && (
            <Button
              sx={{
                whiteSpace: 'nowrap',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: 'black',
                textTransform: 'capitalize',
              }}
              variant="text"
              startIcon={<AddIcon />}
              onClick={() => setIsOpenInputAddStage(true)}
            >
              Add new stage
            </Button>
          )}
        </Box>
        {createPortal(
          <DragOverlay>
            {activeStage && (
              <Stage
                isExistStageName={isExistStageName}
                isDisableDeleteStage={stages.length === 1}
                deleteTask={deleteTask}
                createTask={createTask}
                stage={activeStage}
                removeStage={removeStage}
                updateNameStage={updateNameStage}
                tasks={sortedTasks.filter((task) => task.stageId === activeStage.id)}
                members={members}
                refetchTasks={refetchTasks}
                onOpenMoveTaskForm={onOpenMoveTaskForm}
                onExistStageName={onExistStageName}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                members={members}
                refetchTasks={refetchTasks}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Box>
  )
}

export default KanbanBoard
