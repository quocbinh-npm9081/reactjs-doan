import { Box, TextField } from '@mui/material'
import React from 'react'

import { GetUsersRequest } from '@/types/user/userRequest'

interface Props {
  label: string
  value: string
  id?: keyof GetUsersRequest
  onHandleChange: (value: string, key: keyof GetUsersRequest) => void
}

export const TextFieldOutline: React.FC<Props> = ({ label, id, value, onHandleChange }) => {
  return (
    <Box
      noValidate
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      autoComplete="off"
    >
      <TextField
        value={value}
        id={id ? id : 'outline-input'}
        label={label}
        variant="outlined"
        onChange={(event) => onHandleChange(event.target.value, id as keyof GetUsersRequest)}
      />
    </Box>
  )
}
