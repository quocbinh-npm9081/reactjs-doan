import AddIcon from '@mui/icons-material/Add'
import { Box, Button } from '@mui/material'
import React from 'react'

interface IProps {
  isDragging: boolean
  onOpenInputAddTaskTheEnd: (isOpen: boolean) => void
}
const StageFooter = ({ isDragging, onOpenInputAddTaskTheEnd }: IProps) => {
  return (
    <Box sx={{ visibility: isDragging ? 'hidden' : 'inherit', paddingTop: '10px' }}>
      <Button
        className="flex gap-1 items-center  rounded-md justify-start"
        sx={{
          whiteSpace: 'nowrap',
          width: '100%',
          textTransform: 'capitalize',
          color: '#252A30',
          '& .MuiButton-text:hover': {
            backgroundColor: '#252A30!important',
          },
        }}
        variant="text"
        startIcon={<AddIcon />}
        onClick={() => onOpenInputAddTaskTheEnd(true)}
      >
        Add new task
      </Button>
    </Box>
  )
}

export default StageFooter
