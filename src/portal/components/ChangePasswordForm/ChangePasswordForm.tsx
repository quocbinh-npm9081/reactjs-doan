import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { useChangePasswordMutation } from '@/store/profile/profileApi'
import {
  CONFIRM_PASSWORD_NOTMATCH,
  CONFIRM_PASSWORD_REQUIRED,
  MESSAGE_RESET_PASSWORD_SUCCESS,
  PASSWORD_AT_LEAST_9_CHARACTER,
  PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL,
  PASSWORD_IS_REQUIRE,
  REGEX_VALID_PASSWORD,
} from '@/types/auth/constants'
import {
  MESSAGE_INVALID_KEY_CONFIRM_EMAIL,
  MESSAGE_OLD_PASSWORD_IS_NOT_CORRECT,
} from '@/types/profile/constants'
import { EmessageResponse, IDataResponse } from '@/types/profile/profileResponse'

const validationSchema = Yup.object({
  currentPassword: Yup.string().min(9, PASSWORD_AT_LEAST_9_CHARACTER).required(PASSWORD_IS_REQUIRE),
  newPassword: Yup.string()
    .required(PASSWORD_IS_REQUIRE)
    .min(9, PASSWORD_AT_LEAST_9_CHARACTER)
    .matches(REGEX_VALID_PASSWORD, PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL),
  confirmPassword: Yup.string()
    .required(CONFIRM_PASSWORD_REQUIRED)
    .oneOf([Yup.ref('newPassword')], CONFIRM_PASSWORD_NOTMATCH),
})

const ChangePasswordForm = () => {
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState<boolean>(false)
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false)
  const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState<boolean>(false)
  const [updatePassword, { error, isSuccess, isError, isLoading }] = useChangePasswordMutation()
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      updatePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
    },
  })

  const toggleTypePasswordCurrent = () => setIsShowCurrentPassword((pre) => !pre)

  const toggleTypeNewPassword = () => setIsShowNewPassword((pre) => !pre)

  const toggleTypePasswordConfirm = () => setIsShowPasswordConfirm((pre) => !pre)

  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse
  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.oldPasswordIsNotCorrect]: MESSAGE_OLD_PASSWORD_IS_NOT_CORRECT,
    [EmessageResponse.invalidKeyConfirmEmail]: MESSAGE_INVALID_KEY_CONFIRM_EMAIL,
  }
  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    if (isSuccess) {
      toast.success(MESSAGE_RESET_PASSWORD_SUCCESS)
      navigate('/profile')
    }
  }, [isSuccess, navigate])
  return (
    <>
      <Box noValidate component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
        <Box mt={4}>
          {isError && (
            <Alert component="div" severity="error">
              {messageErr}
            </Alert>
          )}
        </Box>
        <TextField
          fullWidth
          required
          margin="normal"
          id="currentPassword"
          type={isShowCurrentPassword ? 'text' : 'password'}
          label="Current Password"
          className="w-full mt-4 my-4"
          size="small"
          value={formik.values.currentPassword}
          error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
          helperText={
            formik.touched.currentPassword &&
            Boolean(formik.errors.currentPassword) &&
            (formik.errors.currentPassword ?? '')
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className="hover:cursor-pointer"
                onClick={toggleTypePasswordCurrent}
              >
                {isShowCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          fullWidth
          required
          margin="normal"
          id="newPassword"
          type={isShowNewPassword ? 'text' : 'password'}
          label="New Password"
          className="w-full mt-1 my-4"
          size="small"
          value={formik.values.newPassword}
          error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
          helperText={
            formik.touched.newPassword &&
            Boolean(formik.errors.newPassword) &&
            (formik.errors.newPassword ?? '')
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className="hover:cursor-pointer"
                onClick={toggleTypeNewPassword}
              >
                {isShowNewPassword ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <TextField
          fullWidth
          required
          margin="normal"
          id="confirmPassword"
          type={isShowPasswordConfirm ? 'text' : 'password'}
          label="Confirm Password"
          className="w-full mt-1 my-4"
          size="small"
          value={formik.values.confirmPassword}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword) &&
            (formik.errors.confirmPassword ?? '')
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className="hover:cursor-pointer"
                onClick={toggleTypePasswordConfirm}
              >
                {isShowPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Stack spacing={2} direction="row" mt={3} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            className=""
            type="submit"
            disabled={isLoading || !formik.isValid || !formik.dirty}
          >
            {isLoading ? <CircularProgress color="inherit" size="1.5rem" /> : 'CHANGE PASSWORD'}
          </Button>
          <Button
            className=""
            type="button"
            variant="outlined"
            disabled={isLoading}
            component={ReactRouterLink}
            to="/profile"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </>
  )
}

export default ChangePasswordForm
