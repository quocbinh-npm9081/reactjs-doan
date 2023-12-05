import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import {
  CONFIRM_PASSWORD_NOTMATCH,
  CONFIRM_PASSWORD_REQUIRED,
  CONTENT_ALERT_DONT_WANT_CONFIRM_EMAIL,
  PASSWORD_AT_LEAST_9_CHARACTER,
  PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL,
  PASSWORD_IS_REQUIRE,
  REGEX_VALID_PASSWORD,
} from '@/types/auth/constants'

import AlertDialog from '../AlertDialog/AlertDialog'

interface Values {
  key: string
  password: string
  confirmPassword?: string
}

export type ForgotPaswordFormProps = {
  isLoading?: boolean
  isError: boolean
  onSubmit: (value: Values) => void
}

const validationSchema = Yup.object({
  password: Yup.string()
    .required(PASSWORD_IS_REQUIRE)
    .min(9, PASSWORD_AT_LEAST_9_CHARACTER)
    .matches(REGEX_VALID_PASSWORD, PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL),
  confirmPassword: Yup.string()
    .required(CONFIRM_PASSWORD_REQUIRED)
    .oneOf([Yup.ref('password')], CONFIRM_PASSWORD_NOTMATCH),
})

const ResetPasswordForm: React.FC<ForgotPaswordFormProps> = ({ isLoading, onSubmit }) => {
  const { id } = useParams()
  const [isOpenDialog, setOpenDialog] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      key: String(id),
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: Values) => {
      onSubmit({ password: values.password, key: values.key })
    },
  })

  const toggleTypePassword = () => setShowPassword((pre) => !pre)

  const toggleTypePasswordConfirm = () => setShowPasswordConfirm((pre) => !pre)

  return (
    <>
      <AlertDialog
        redirect="/"
        isOpenDialog={isOpenDialog}
        setopenDialog={setOpenDialog}
        content={CONTENT_ALERT_DONT_WANT_CONFIRM_EMAIL}
        title="Notification"
      />
      <Box noValidate component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          required
          margin="normal"
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          className="w-full my-4"
          size="small"
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={
            formik.touched.password &&
            Boolean(formik.errors.password) &&
            (formik.errors.password ?? '')
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className="hover:cursor-pointer"
                onClick={toggleTypePassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
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
          type={showPasswordConfirm ? 'text' : 'password'}
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
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </InputAdornment>
            ),
          }}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <Stack spacing={2} direction="column" mt={3}>
          <Button
            variant="contained"
            color="primary"
            className=""
            type="submit"
            disabled={isLoading || !formik.isValid || !formik.dirty}
          >
            {isLoading ? <CircularProgress color="inherit" size="1.5rem" /> : 'RESET PASSWORD'}
          </Button>

          <Box sx={{ with: '100%', marginTop: '34px!important' }}>
            <Link to="/sign-in">
              <Typography gutterBottom variant="body1" display="block">
                Back to sign in
              </Typography>
            </Link>
          </Box>
        </Stack>
      </Box>
    </>
  )
}

export default ResetPasswordForm
