import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import * as React from 'react'

interface Props {
  title: string
  onClick?: () => void
}

export const ButtonContainer = (props: Props) => {
  const { title, onClick } = props
  return (
    <Stack spacing={2} direction="row">
      <Button size="large" variant="contained" onClick={onClick}>
        {title}
      </Button>
    </Stack>
  )
}
