import Tooltip from '@mui/material/Tooltip'
import * as React from 'react'

export default function BasicTooltip({
  children,
  title,
}: {
  children: React.ReactElement
  title: string
}) {
  return <Tooltip title={title}>{children}</Tooltip>
}
