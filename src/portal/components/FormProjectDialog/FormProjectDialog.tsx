import { DialogActions } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import { IDataUpdateProjectResponse } from '@/types/BaseResponse'
import { MESSAGE_PROJECT_NAME_ALREADY_TAKEN } from '@/types/project/constants'
import { TypeFormProject } from '@/types/project/projectEnum'
import { EmessageUpdateProjectResponse } from '@/types/project/projectResponse'

export type TtextFields = {
  name: string
  label: string
  type: 'email' | 'text' | 'password'
  variant?: 'standard' | 'outlined' | 'filled'
  multiline?: boolean
  minRows?: number
}

interface IProps {
  initialValues: Record<string, string>
  validationSchema: yup.ObjectSchema<
    { [key: string]: string | undefined },
    yup.AnyObject,
    { [key: string]: undefined },
    ''
  >
  textFields: TtextFields[]
  title: TypeFormProject
  isOpen: boolean
  description?: string
  setIsOpen: (value: boolean) => void
  error: FetchBaseQueryError | SerializedError | undefined
  isError: boolean
  enableResetForm: boolean
  onSubmit: (values: Record<string, string>) => void
}

export default function FormProjectDialog({
  initialValues,
  validationSchema,
  textFields,
  title,
  isOpen,
  description,
  setIsOpen,
  error,
  isError,
  enableResetForm,
  onSubmit,
}: IProps) {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values)
      formik.dirty = true
      if (enableResetForm) {
        formik.resetForm()
      }
    },
  })

  const handleClose = () => {
    setIsOpen(false)
    if (enableResetForm) {
      formik.resetForm()
    } else {
      formik.setValues(initialValues)
    }
  }
  const errorResponse = { ...error } as IDataUpdateProjectResponse
  const errorCode = errorResponse.data?.errorCode as EmessageUpdateProjectResponse | null

  const customMessages: Record<EmessageUpdateProjectResponse, string> = {
    [EmessageUpdateProjectResponse.projectnameAlreadyExists]: MESSAGE_PROJECT_NAME_ALREADY_TAKEN,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    formik.setValues(initialValues)
  }, [initialValues])

  useEffect(() => {
    if (isError) {
      toast.error(messageErr)
    }
  }, [isError])

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
          {description && <DialogContentText>{description}</DialogContentText>}
          {textFields.map((textField) => (
            <TextField
              key={textField.name}
              fullWidth
              sx={{ marginBottom: '10px' }}
              margin="dense"
              id={textField.name}
              name={textField.name}
              label={textField.label}
              type={textField.type}
              variant={textField.variant ? textField.variant : 'standard'}
              value={formik.values[textField.name]}
              error={formik.touched[textField.name] && Boolean(formik.errors[textField.name])}
              helperText={
                formik.touched[textField.name] &&
                Boolean(formik.errors[textField.name]) &&
                (formik.errors[textField.name] ?? '')
              }
              multiline={textField.multiline ? textField.multiline : false}
              minRows={textField.minRows ? textField.minRows : undefined}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ padding: '10px 24px' }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          {title === TypeFormProject.CREATE_NEW_PROJECT ? (
            <Button type="submit" variant="contained" disabled={!formik.isValid || !formik.dirty}>
              Create
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={!formik.isValid || !formik.dirty}>
              Save
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  )
}
