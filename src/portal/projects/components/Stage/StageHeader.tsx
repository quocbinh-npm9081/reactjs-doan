import { Box, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'

import { TStage } from '@/types/project/projectResponse'

import StageMenuButton from './StageMenuButton'

interface IProps {
  editMode: boolean
  stage: TStage
  updateNameStage: (id: string, name: string) => void
  onEditMode: (isEdit: boolean) => void
  onOpenInputAddTaskAtTheBeginning: (isOpen: boolean) => void
  onRemoveStage: (stageId: string) => void
  isExistStageName: boolean | null
  isDisableDeleteStage: boolean
  onExistStageName: (isExist: boolean) => void
}

type TOption = {
  title: string
  onClick?: () => void
}
const StageHeader = ({
  editMode,
  stage,
  updateNameStage,
  onEditMode,
  onOpenInputAddTaskAtTheBeginning,
  onRemoveStage,
  isExistStageName,
  isDisableDeleteStage,
  onExistStageName,
}: IProps) => {
  const [stageName, setStageName] = useState<string>(stage.name)

  const nameStageInput = useCallback((inputElement: HTMLDivElement) => {
    if (inputElement) {
      inputElement.focus()
    }
  }, [])
  const options: TOption[] = [
    {
      title: 'Add task',
      onClick: () => onOpenInputAddTaskAtTheBeginning(true),
    },
    {
      title: 'Delete stage',
      onClick: isDisableDeleteStage ? undefined : () => onRemoveStage(stage.id),
    },
  ]
  useEffect(() => {
    if (isExistStageName) {
      onExistStageName(false)
      setStageName(stage.name)
    }
  }, [isExistStageName])

  useEffect(() => {
    setStageName(stage.name)
  }, [stage.name])

  return (
    <>
      <Box className="rounded-md py-3 pl-3" sx={{ width: '250px' }}>
        {!editMode && (
          <Typography
            fontWeight="700"
            variant="body1"
            sx={{ wordBreak: 'break-word' }}
            onClick={() => onEditMode(true)}
          >
            <span style={{ textTransform: 'uppercase' }}>{stageName}</span>
          </Typography>
        )}
        {editMode && (
          <TextField
            hiddenLabel
            variant="standard"
            inputRef={nameStageInput}
            sx={{
              '& .MuiInputBase-input ': {
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: '1.5',
              },
            }}
            className=" focus:border-rose-500 border rounded outline-none p-0 w-full"
            value={stageName}
            inputProps={{ 'aria-label': 'name of stage' }}
            onChange={(e) => setStageName(e.target.value)}
            onBlur={() => {
              onEditMode(false)
              updateNameStage(stage.id, stageName)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return
              onEditMode(false)
              updateNameStage(stage.id, stageName)
            }}
          />
        )}
      </Box>
      <Box className="top-1 right-0 absolute">
        <StageMenuButton options={options} />
      </Box>
    </>
  )
}

export default StageHeader
