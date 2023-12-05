import { TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

import { TaskResponse } from '@/types/task/taskResponse'

interface TProps {
  dataTask: TaskResponse | undefined
  editModeTitle: boolean
  onEditModeTitle: (isEdit: boolean) => void
  updateTaskTitle: (id: string | undefined, name: string | undefined) => void
}
export default function TaskTitleDialog({
  editModeTitle,
  dataTask,
  onEditModeTitle,
  updateTaskTitle,
}: TProps) {
  const [taskTitle, setTaskTitle] = useState<string | undefined>(dataTask?.title)

  const taskTitleInput = useCallback((inputElement: HTMLDivElement) => {
    if (inputElement) {
      inputElement.focus()
    }
  }, [])
  useEffect(() => {
    setTaskTitle(dataTask?.title)
  }, [dataTask?.title])

  return (
    <>
      {!editModeTitle && (
        <Typography
          fontWeight="700"
          variant="body1"
          sx={{ wordBreak: 'break-word', fontSize: '24px' }}
          onClick={() => onEditModeTitle(true)}
        >
          {taskTitle}
        </Typography>
      )}
      {editModeTitle && (
        <TextField
          hiddenLabel
          id={dataTask?.id}
          variant="standard"
          inputRef={taskTitleInput}
          sx={{
            '& .MuiInputBase-input ': {
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '1.5',
            },
          }}
          className=" focus:border-rose-500 border rounded outline-none p-0 w-full"
          defaultValue={taskTitle}
          inputProps={{ 'aria-label': 'title of task' }}
          onChange={(e) => setTaskTitle(e.target.value)}
          onBlur={() => {
            onEditModeTitle(false)
            updateTaskTitle(dataTask?.id, taskTitle)
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            onEditModeTitle(false)
            updateTaskTitle(dataTask?.id, taskTitle)
          }}
        />
      )}
    </>
  )
}
