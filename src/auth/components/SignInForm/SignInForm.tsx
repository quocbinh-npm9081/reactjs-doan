import { Email, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'

import { signInValidationSchema } from '../../../commons/validation/validationSchema'
import { LoginRequest } from '../../../types/auth/login/loginRequest'

const initialValues = {
  username: '',
  password: '',
}

export type SignInFormProps = {
  isLoading?: boolean
  onSubmit: (value: LoginRequest) => void
}

export default function SigninForm({ isLoading, onSubmit }: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signInValidationSchema,
    onSubmit: (values) => {
      const data: LoginRequest = { ...values }
      onSubmit(data)
    },
  })

  const toggleTypePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box noValidate component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
      <TextField
        fullWidth
        required
        margin="normal"
        type="email"
        id="username"
        label="Username"
        className="w-full h-16 mt-4"
        size="small"
        value={formik.values.username}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={
          formik.touched.username &&
          Boolean(formik.errors.username) &&
          (formik.errors.username ?? '')
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
      <TextField
        fullWidth
        required
        margin="normal"
        id="password"
        type={showPassword ? 'text' : 'password'}
        label="Password"
        className="w-full h-16 mt-4"
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
      <Stack spacing={2} direction="column">
        <div className="self-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-primary w-fit decoration-green no-underline hover:underline"
          >
            <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
              Forgot password?
            </Typography>
          </Link>
        </div>
        <Button
          variant="contained"
          color="primary"
          className=""
          type="submit"
          disabled={isLoading || !formik.isValid || !formik.dirty}
        >
          Sign In
          {isLoading && <CircularProgress color="inherit" size="1.5rem" />}
        </Button>
      </Stack>
    </Box>
  )
}
