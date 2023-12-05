import { DialogActions } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import * as React from 'react'

import { EMoveTaskPosition } from '@/types/project/projectEnum'
import { TStage } from '@/types/project/projectResponse'

import { IInititalValuesTask } from '../../views/KanbanBoard/KanbanBoard'

export type TtextFields = {
  name: string
  label: string
  type: 'email' | 'text' | 'password'
  variant?: 'standard' | 'outlined' | 'filled'
  multiline?: boolean
  minRows?: number
}

interface IProps {
  initialValues: IInititalValuesTask
  options: TStage[]
  title: string
  isOpen: boolean
  onCloseMoveTaskForm: () => void
  onSubmit: (values: IInititalValuesTask) => void
}

export default function TaskMoveForm({
  initialValues,
  options,
  title,
  isOpen,
  onSubmit,
  onCloseMoveTaskForm,
}: IProps) {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      onSubmit(values)
    },
  })

  const handleClose = () => {
    onCloseMoveTaskForm()
    formik.resetForm()
  }

  useEffect(() => {
    formik.setValues(initialValues)
  }, [initialValues])

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        noValidate
        component="form"
        autoComplete="off"
        sx={{ padding: '10px 0 20px 0' }}
        onSubmit={formik.handleSubmit}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ minWidth: '500px!important', paddingBottom: 0 }}>
          {options && (
            <FormControl
              fullWidth
              sx={{
                marginTop: '10px',
              }}
            >
              <InputLabel id="demo-simple-select-label-stage">Stage</InputLabel>
              <Select
                labelId="demo-simple-select-label-stage"
                id="demo-simple-select-stage"
                value={formik.values.stageIdNew}
                label="stage"
                onChange={(nextValue) => {
                  formik.setFieldValue('stageIdNew', nextValue.target.value)
                }}
              >
                {options.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl
            fullWidth
            sx={{
              marginTop: '15px',
              marginBottom: '15px',
            }}
          >
            <InputLabel id="demo-simple-select-label-position">Position</InputLabel>
            <Select
              labelId="demo-simple-select-label-position"
              id="demo-simple-select-position"
              value={formik.values.position}
              label="position"
              onChange={(nextValue) => {
                formik.setFieldValue('position', nextValue.target.value)
              }}
            >
              <MenuItem value={EMoveTaskPosition.MOVE_ON_THE_BEGINNING}>First</MenuItem>
              <MenuItem value={EMoveTaskPosition.MOVE_ON_THE_END}>Last</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: '10px 24px' }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Move
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
