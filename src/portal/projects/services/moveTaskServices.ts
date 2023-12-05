import {
  TTaskBehindActiveTaskUpdated,
  TTaskInFormOfActiveTaskUpdated,
  TTaskRequestUpdatePosition,
  TUpdateTaskAfterMoveTask,
} from '@/types/project/projectRequest'
import { TTaskResponse } from '@/types/project/projectResponse'

export const moveTheTaskInThe2ndPositionToTheTopOfTheStage = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition: TTaskRequestUpdatePosition[] = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskInFormOfActiveTaskUpdated.id,
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
    {
      id: String(taskBehindActiveTaskUpdated.id),
      stageId: String(taskBehindActiveTaskUpdated.stageId),
      preTaskId: taskBehindActiveTaskUpdated.previousId
        ? taskBehindActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskBehindActiveTaskUpdated.nextId ? taskBehindActiveTaskUpdated.nextId : null,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskInThe3ndPositionToTheTopOfTheStage = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  taskAtBeginningUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition: TTaskRequestUpdatePosition[] = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskInFormOfActiveTaskUpdated.id),
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId
        ? taskInFormOfActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
    {
      id: String(taskBehindActiveTaskUpdated.id),
      stageId: String(taskBehindActiveTaskUpdated.stageId),
      preTaskId: taskBehindActiveTaskUpdated.previousId
        ? taskBehindActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskBehindActiveTaskUpdated.nextId ? taskBehindActiveTaskUpdated.nextId : null,
    },
    {
      id: taskAtBeginningUpdated.id,
      stageId: taskAtBeginningUpdated.stageId,
      preTaskId: taskAtBeginningUpdated.previousId,
      nextTaskId: taskAtBeginningUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskAtTheEndHasATaskInFrontOfItNotTheFirstTaskToTheTopStage = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskAtBeginningUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition: TTaskRequestUpdatePosition[] = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskInFormOfActiveTaskUpdated.id),
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId
        ? taskInFormOfActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
    {
      id: taskAtBeginningUpdated.id,
      stageId: taskAtBeginningUpdated.stageId,
      preTaskId: taskAtBeginningUpdated.previousId,
      nextTaskId: taskAtBeginningUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskAtTheEndHasATaskInFrontOfItIsTheFirstTaskToTheTopStage = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition: TTaskRequestUpdatePosition[] = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskInFormOfActiveTaskUpdated.id),
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId
        ? taskInFormOfActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskAtTheBegginngTaskInTheEndToTheBottomStage = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskInFormOfActiveTaskUpdated.id),
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId
        ? taskInFormOfActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
    {
      id: String(taskBehindActiveTaskUpdated.id),
      stageId: String(taskBehindActiveTaskUpdated.stageId),
      preTaskId: taskBehindActiveTaskUpdated.previousId
        ? taskBehindActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskBehindActiveTaskUpdated.nextId ? taskBehindActiveTaskUpdated.nextId : null,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskHaveTaskInTheBeggningnAndTaskInTheBehind = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskInFormOfActiveTaskUpdated.id),
      stageId: String(taskInFormOfActiveTaskUpdated.stageId),
      preTaskId: taskInFormOfActiveTaskUpdated.previousId
        ? taskInFormOfActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId
        ? taskInFormOfActiveTaskUpdated.nextId
        : null,
    },
    {
      id: String(taskBehindActiveTaskUpdated.id),
      stageId: String(taskBehindActiveTaskUpdated.stageId),
      preTaskId: taskBehindActiveTaskUpdated.previousId
        ? taskBehindActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskBehindActiveTaskUpdated.nextId ? taskBehindActiveTaskUpdated.nextId : null,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]

  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopHasTheBehindTaskToTheBottomStage = (
  activeTaskUpdated: TTaskResponse,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: String(taskBehindActiveTaskUpdated.id),
      stageId: String(taskBehindActiveTaskUpdated.stageId),
      preTaskId: taskBehindActiveTaskUpdated.previousId
        ? taskBehindActiveTaskUpdated.previousId
        : null,
      nextTaskId: taskBehindActiveTaskUpdated.nextId ? taskBehindActiveTaskUpdated.nextId : null,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopHasTheBehindTaskIsTheEndTaskToTheBottomStage = (
  activeTaskUpdated: TTaskResponse,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasTasks = (
  activeTaskUpdated: TTaskResponse,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  taskAtTheBiginningUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskBehindActiveTaskUpdated.id,
      stageId: taskBehindActiveTaskUpdated.stageId,
      preTaskId: taskBehindActiveTaskUpdated.previousId,
      nextTaskId: taskBehindActiveTaskUpdated.nextId,
    },
    {
      id: taskAtTheBiginningUpdated.id,
      stageId: taskAtTheBiginningUpdated.stageId,
      preTaskId: taskAtTheBiginningUpdated.previousId,
      nextTaskId: taskAtTheBiginningUpdated.nextId,
    },
  ]

  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopHasTheBehindTaskToTheTopOfNewStageHasNotTask = (
  activeTaskUpdated: TTaskResponse,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskBehindActiveTaskUpdated.id,
      stageId: taskBehindActiveTaskUpdated.stageId,
      preTaskId: taskBehindActiveTaskUpdated.previousId,
      nextTaskId: taskBehindActiveTaskUpdated.nextId,
    },
  ]

  return tasksRequestUpdatePosition
}
export const moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasTasks =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
    taskAtTheBiginningUpdated: TTaskBehindActiveTaskUpdated,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
      {
        id: taskAtTheBiginningUpdated.id,
        stageId: taskAtTheBiginningUpdated.stageId,
        preTaskId: taskAtTheBiginningUpdated.previousId,
        nextTaskId: taskAtTheBiginningUpdated.nextId,
      },
    ]

    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisInBegginningToTheTopOfNewStageHasNotTask =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
    ]

    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasNotTask =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
    taskAtTheBiginningUpdated: TTaskResponse,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
      {
        id: taskAtTheBiginningUpdated.id,
        stageId: taskAtTheBiginningUpdated.stageId,
        preTaskId: taskAtTheBiginningUpdated.previousId,
        nextTaskId: taskAtTheBiginningUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTheBehindTaskAndTheTaskInFormOfThisAndThisIsTheBeggningTaskToTheTopOfNewStageHasTask =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasTasks = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskAtTheBiginningUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskInFormOfActiveTaskUpdated.id,
      stageId: taskInFormOfActiveTaskUpdated.stageId,
      preTaskId: taskInFormOfActiveTaskUpdated.previousId,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
    },
    {
      id: taskAtTheBiginningUpdated.id,
      stageId: taskAtTheBiginningUpdated.stageId,
      preTaskId: taskAtTheBiginningUpdated.previousId,
      nextTaskId: taskAtTheBiginningUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheBottomCurrentStageHasTaskInFormOfThisToTheTopNewStageHasNotTask = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskInFormOfActiveTaskUpdated.id,
      stageId: taskInFormOfActiveTaskUpdated.stageId,
      preTaskId: taskInFormOfActiveTaskUpdated.previousId,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks = (
  activeTaskUpdated: TTaskResponse,
  taskAtTheBiginningUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskAtTheBiginningUpdated.id,
      stageId: taskAtTheBiginningUpdated.stageId,
      preTaskId: taskAtTheBiginningUpdated.previousId,
      nextTaskId: taskAtTheBiginningUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasTaskTheEnd = (
  activeTaskUpdated: TTaskResponse,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskBehindActiveTaskUpdated.id,
      stageId: taskBehindActiveTaskUpdated.stageId,
      preTaskId: taskBehindActiveTaskUpdated.previousId,
      nextTaskId: taskBehindActiveTaskUpdated.nextId,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheTopCurrentStageHasTaskBehindAndNewStageHasNotTaskTheEnd = (
  activeTaskUpdated: TTaskResponse,
  taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskBehindActiveTaskUpdated.id,
      stageId: taskBehindActiveTaskUpdated.stageId,
      preTaskId: taskBehindActiveTaskUpdated.previousId,
      nextTaskId: taskBehindActiveTaskUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasTasks =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
    taskAtTheEndUpdated: TTaskResponse,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
      {
        id: taskAtTheEndUpdated.id,
        stageId: taskAtTheEndUpdated.stageId,
        preTaskId: taskAtTheEndUpdated.previousId,
        nextTaskId: taskAtTheEndUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfItIsCurrentTaskAtTheBiginningNewStageHasNotTask =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasTasks =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
    taskAtTheEndUpdated: TTaskResponse,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
      {
        id: taskAtTheEndUpdated.id,
        stageId: taskAtTheEndUpdated.stageId,
        preTaskId: taskAtTheEndUpdated.previousId,
        nextTaskId: taskAtTheEndUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskHasTaskBehindAndTaskInFormOfItAndTaskFormOfThisDotNotcurrentTaskAtTheBiginningNewStageHasNotTasks =
  (
    activeTaskUpdated: TTaskResponse,
    taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
    taskBehindActiveTaskUpdated: TTaskBehindActiveTaskUpdated,
  ) => {
    const tasksRequestUpdatePosition = [
      {
        id: activeTaskUpdated.id,
        stageId: activeTaskUpdated.stageId,
        preTaskId: activeTaskUpdated.previousId,
        nextTaskId: activeTaskUpdated.nextId,
      },
      {
        id: taskInFormOfActiveTaskUpdated.id,
        stageId: taskInFormOfActiveTaskUpdated.stageId,
        preTaskId: taskInFormOfActiveTaskUpdated.previousId,
        nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
      },
      {
        id: taskBehindActiveTaskUpdated.id,
        stageId: taskBehindActiveTaskUpdated.stageId,
        preTaskId: taskBehindActiveTaskUpdated.previousId,
        nextTaskId: taskBehindActiveTaskUpdated.nextId,
      },
    ]
    return tasksRequestUpdatePosition
  }
export const moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasTaskAtTheEnd = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskInFormOfActiveTaskUpdated.id,
      stageId: taskInFormOfActiveTaskUpdated.stageId,
      preTaskId: taskInFormOfActiveTaskUpdated.previousId,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskOnTheEndStageHasTaskInFormOfItNewStageHasNotTask = (
  activeTaskUpdated: TTaskResponse,
  taskInFormOfActiveTaskUpdated: TTaskInFormOfActiveTaskUpdated,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskInFormOfActiveTaskUpdated.id,
      stageId: taskInFormOfActiveTaskUpdated.stageId,
      preTaskId: taskInFormOfActiveTaskUpdated.previousId,
      nextTaskId: taskInFormOfActiveTaskUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}
export const moveTheTaskHasNotTaskBehindAndTaskInFormOfItNewStageHasTasks = (
  activeTaskUpdated: TTaskResponse,
  taskAtTheEndUpdated: TTaskResponse,
) => {
  const tasksRequestUpdatePosition = [
    {
      id: activeTaskUpdated.id,
      stageId: activeTaskUpdated.stageId,
      preTaskId: activeTaskUpdated.previousId,
      nextTaskId: activeTaskUpdated.nextId,
    },
    {
      id: taskAtTheEndUpdated.id,
      stageId: taskAtTheEndUpdated.stageId,
      preTaskId: taskAtTheEndUpdated.previousId,
      nextTaskId: taskAtTheEndUpdated.nextId,
    },
  ]
  return tasksRequestUpdatePosition
}

export const updateTasksAfterMoveTask = (
  oldTasks: TTaskResponse[],
  newTasks: TUpdateTaskAfterMoveTask[],
) => {
  const tasksUpdated = oldTasks.map((oldTask) => {
    const result = newTasks.find((newTask) => newTask.id === oldTask.id)
    return result ? result : oldTask
  }) as TTaskResponse[]
  return tasksUpdated
}
