import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { Box, Button, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'

// eslint-disable-next-line import/namespace
import { TTaskRequest } from '@/types/project/projectRequest'
import { IProjectMembers, TStage, TTaskResponse } from '@/types/project/projectResponse'

import TaskCard from '../Task/Task'
import StageFooter from './StageFooter'
import StageHeader from './StageHeader'

interface IProps {
  stage: TStage
  removeStage: (id: string) => void
  updateNameStage: (id: string, name: string) => void
  createTask: (task: TTaskRequest) => void
  tasks: TTaskResponse[]
  deleteTask: (taskId: string) => void
  isDisableDeleteStage: boolean
  isExistStageName: boolean | null
  members: IProjectMembers[] | undefined
  refetchTasks: () => void
  onExistStageName: (isExist: boolean) => void
  onOpenMoveTaskForm: (task: TTaskResponse) => void
}

const schema = yup.object({
  title: yup.string().required(),
})

const Stage: React.FC<IProps> = ({
  stage,
  removeStage,
  updateNameStage,
  createTask,
  tasks,
  deleteTask,
  isDisableDeleteStage,
  isExistStageName,
  members,
  refetchTasks,
  onExistStageName,
  onOpenMoveTaskForm,
}) => {
  const { id } = useParams()
  const [editMode, setEditMode] = useState<boolean>(false)
  const [isOpenInputAddTaskAtTheBeginning, setIsOpenInputAddTaskAtTheBeginning] =
    useState<boolean>(false)
  const [isOpenInputAddTaskAtTheEnd, setIsOpenInputAddTaskAtTheEnd] = useState<boolean>(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: stage.id,
    data: {
      type: 'Stage',
      stage,
    },
    disabled: editMode,
  })

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  const checkPointerTask = () => {
    let pointer: { previousId: string | null; nextId: string | null } = {
      previousId: null,
      nextId: null,
    }
    if (isOpenInputAddTaskAtTheEnd && taskLast && taskLast.id) {
      pointer = {
        previousId: taskLast.id,
        nextId: null,
      }
    }
    if (isOpenInputAddTaskAtTheBeginning && taskFirst && taskFirst.id) {
      pointer = {
        previousId: null,
        nextId: taskFirst.id,
      }
    }
    return pointer
  }
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      projectId: null,
      stageId: null,
      previousId: null,
      nextId: null,
    },
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      if (id) {
        const newTask: TTaskRequest = {
          title: values.title,
          description: '',
          projectId: id,
          stageId: stage.id,
          previousId: checkPointerTask().previousId,
          nextId: checkPointerTask().nextId,
        }
        createTask(newTask)
        resetForm()
        if (isOpenInputAddTaskAtTheEnd) setIsOpenInputAddTaskAtTheEnd(false)
        if (isOpenInputAddTaskAtTheBeginning) setIsOpenInputAddTaskAtTheBeginning(false)
      }
    },
  })

  const sortedTasks = tasks

  const taskLast = sortedTasks.length > 0 ? sortedTasks[sortedTasks.length - 1] : null
  const taskFirst = sortedTasks.length > 0 ? sortedTasks[0] : null
  useEffect(() => {
    if (!isOpenInputAddTaskAtTheBeginning || !isOpenInputAddTaskAtTheEnd) formik.resetForm()
  }, [isOpenInputAddTaskAtTheBeginning, isOpenInputAddTaskAtTheEnd])

  useEffect(() => {
    if (isDragging && (isOpenInputAddTaskAtTheBeginning || isOpenInputAddTaskAtTheEnd)) {
      if (isOpenInputAddTaskAtTheBeginning) setIsOpenInputAddTaskAtTheBeginning(false)
      if (isOpenInputAddTaskAtTheEnd) setIsOpenInputAddTaskAtTheEnd(false)
    }
  }, [isDragging])

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      className="mt-7 rounded-md flex flex-col p-2"
      style={style}
      sx={{
        boxShadow: isDragging ? 0 : 3,
        backgroundColor: '#C0E3DC',
        width: '300px',
        height: 'auto',
        maxHeight: '78vh',
        marginRight: '10px',
        color: isDragging ? '#F4EADE' : '#252A30',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {/* stage name */}
      <Box
        className="flex justify-between items-center rounded-md relative cursor-grab mb-2"
        sx={{
          visibility: isDragging ? 'hidden' : 'inherit',
        }}
        {...listeners}
      >
        {stage && (
          <StageHeader
            isExistStageName={isExistStageName}
            editMode={editMode}
            isDisableDeleteStage={isDisableDeleteStage}
            stage={stage}
            updateNameStage={updateNameStage}
            onExistStageName={onExistStageName}
            onEditMode={setEditMode}
            onRemoveStage={removeStage}
            onOpenInputAddTaskAtTheBeginning={setIsOpenInputAddTaskAtTheBeginning}
          />
        )}
      </Box>
      {/* tasks container */}
      <Box
        sx={{
          padding: '0 10px',
          height: '100%',
          overflowX: 'auto',
          flexGrow: 1,
          visibility: isDragging ? 'hidden' : 'inherit',
        }}
      >
        {isOpenInputAddTaskAtTheBeginning && (
          <ClickAwayListener onClickAway={() => setIsOpenInputAddTaskAtTheBeginning(false)}>
            <Box
              noValidate
              className="flex flex-col justify-start items-start w-full pb-2"
              component="form"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                autoFocus
                multiline
                fullWidth
                type="text"
                id="title"
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                placeholder="Add title for this task"
                maxRows="7"
                minRows="3"
                className="flex items-start p-2 overflow-x-hidden overflow-y-auto flex-col mb-2 rounded-md text-left w-full relative"
                sx={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  boxShadow:
                    '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                  backgroundColor: '#ffffff',
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                sx={{
                  textTransform: 'capitalize',
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add new task
              </Button>
            </Box>
          </ClickAwayListener>
        )}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              stage={stage}
              members={members}
              refetchTasks={refetchTasks}
              onOpenMoveTaskForm={onOpenMoveTaskForm}
            />
          ))}
        </SortableContext>
        {isOpenInputAddTaskAtTheEnd && (
          <ClickAwayListener onClickAway={() => setIsOpenInputAddTaskAtTheEnd(false)}>
            <Box
              noValidate
              className="flex flex-col justify-start items-start w-full pb-2"
              component="form"
              autoComplete="off"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                autoFocus
                multiline
                fullWidth
                id="title"
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                placeholder="Add title for this task"
                maxRows="7"
                minRows="3"
                className="flex items-start p-2 overflow-x-hidden overflow-y-auto flex-col mb-2 rounded-md text-left w-full relative"
                sx={{
                  fontSize: '1rem',
                  fontWeight: '400',
                  boxShadow:
                    '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                  backgroundColor: '#ffffff',
                }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                sx={{
                  textTransform: 'capitalize',
                }}
                type="submit"
                variant="contained"
                color="primary"
              >
                Add new task
              </Button>
            </Box>
          </ClickAwayListener>
        )}
      </Box>
      {/* stage footer */}
      <StageFooter
        isDragging={isDragging}
        onOpenInputAddTaskTheEnd={setIsOpenInputAddTaskAtTheEnd}
      />
    </Box>
  )
}

export default Stage
