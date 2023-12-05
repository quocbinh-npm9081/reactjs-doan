import { TTaskResponse } from '@/types/project/projectResponse'

export const mapOrder = (originalArray: TTaskResponse[], orderArray: string[]): TTaskResponse[] => {
  if (originalArray.length === 0 || orderArray.length === 0) return []

  const idLookup = structuredClone(originalArray).reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, Object.create(null)) as Record<string, TTaskResponse>

  const sortedArray: TTaskResponse[] = orderArray.map((id) => idLookup[id])

  sortedArray.forEach((item: TTaskResponse, index: number) => {
    item.previousId = index > 0 ? sortedArray[index - 1].id : null
    item.nextId = index < sortedArray.length - 1 ? sortedArray[index + 1].id : null
  })

  return sortedArray
}

export const updatedTaskResquestPosition = (updatedTasks: TTaskResponse[]) => {
  const body = updatedTasks.map((task) => {
    return {
      id: task.id,
      stageId: task.stageId,
      preTaskId: task.previousId,
      nextTaskId: task.nextId,
    }
  })
  return body
}

export const sortTasksByNextAndPrevious = (tasks: TTaskResponse[]) => {
  const taskMap = new Map()
  const sortedTasks: TTaskResponse[] = [...tasks]
  sortedTasks.forEach((task: TTaskResponse) => {
    taskMap.set(task.id, task)
  })
  const result = [] as TTaskResponse[]
  let currentTask = tasks.find((task: TTaskResponse) => !task.previousId)
  while (currentTask) {
    result.push(currentTask)
    const nextTaskId = currentTask.nextId
    currentTask = nextTaskId ? taskMap.get(nextTaskId) : null
  }

  return result
}

export function groupTasksByStageId(nestedArray: TTaskResponse[][]): TTaskResponse[] {
  const flattenedArray = [] as TTaskResponse[]

  for (const subArray of nestedArray) {
    flattenedArray.push(...subArray)
  }

  return flattenedArray
}

export const moveObjectInArray = (
  tasks: TTaskResponse[],
  taskObjectId: string,
  targetIndex: number,
): TTaskResponse[] => {
  const cloneTasks = structuredClone(tasks)
  const currentIndex = cloneTasks.findIndex((obj) => obj.id === taskObjectId)

  if (currentIndex === -1) {
    return cloneTasks
  }

  const removedObject = cloneTasks.splice(currentIndex, 1)[0]

  cloneTasks.splice(targetIndex, 0, removedObject)

  return cloneTasks
}
