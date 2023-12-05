import { Email } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'

import { Values } from '@/portal/users/views/ChangeEmail/ChangeEmailPage'
import { signOut } from '@/store/auth/authSlice'
import { EMAIL_INVALID, EMAIL_REQUIRED, REGEX_VALID_EMAIL } from '@/types/auth/constants'
import {
  MESSAGE_INVALID_KEY_CONFIRM_EMAIL,
  MESSAGE_OLD_PASSWORD_IS_NOT_CORRECT,
} from '@/types/profile/constants'
import { EmessageResponse, IDataResponse } from '@/types/profile/profileResponse'

interface IPropsChangeEmailForm {
  onSubmit: (values: Values) => void
  isLoading?: boolean
  isError?: boolean
  error?: IDataResponse | FetchBaseQueryError | SerializedError
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email(EMAIL_INVALID)
    .required(EMAIL_REQUIRED)
    .matches(REGEX_VALID_EMAIL, EMAIL_INVALID),
})

const ChangeEmailForm: React.FC<IPropsChangeEmailForm> = ({
  onSubmit,
  isLoading,
  isError,
  error,
}) => {
  const { id } = useParams()
  const dispath = useDispatch()
  const formik = useFormik({
    initialValues: {
      id: String(id),
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values) => {
      onSubmit(values)
    },
  })
  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse

  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.oldPasswordIsNotCorrect]: MESSAGE_OLD_PASSWORD_IS_NOT_CORRECT,
    [EmessageResponse.invalidKeyConfirmEmail]: MESSAGE_INVALID_KEY_CONFIRM_EMAIL,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''

  const backToSignIn = () => {
    dispath(signOut())
  }

  return (
    <Box noValidate component="form" width="100%" autoComplete="off" onSubmit={formik.handleSubmit}>
      {isError && (
        <Stack sx={{ width: '100%' }} spacing={2} mb={1}>
          <Alert severity="error">{messageErr}</Alert>
        </Stack>
      )}

      <TextField
        fullWidth
        required
        margin="normal"
        type="email"
        id="email"
        label="Email"
        className="w-full h-16 mt-4"
        size="small"
        value={formik.values.email}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={
          formik.touched.email && Boolean(formik.errors.email) && (formik.errors.email ?? '')
        }
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Email />
            </InputAdornment>
          ),
        }}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />

      <Stack spacing={3} direction="column">
        <Button
          variant="contained"
          color="primary"
          className=""
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
        >
          {isLoading ? <CircularProgress color="inherit" size="1.5rem" /> : 'Confirm'}
        </Button>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Box display="inline" onClick={backToSignIn}>
            <Typography
              gutterBottom
              variant="body2"
              display="block"
              color="#1976d2"
              sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              Back to sign in
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default ChangeEmailForm
