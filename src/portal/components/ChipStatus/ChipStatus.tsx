import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import * as React from 'react'

interface IProps {
  color?: 'primary' | 'success' | 'error' | 'info' | 'warning'
  variant?: 'outlined' | 'filled'
  label: string
  spacing?: number
  onClick?: () => void
}
const ColorChips: React.FC<IProps> = ({ color = 'primary', variant = 'outlined', label }) => {
  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Chip label={label} color={color} variant={variant} />
    </Stack>
  )
}
export default ColorChips
