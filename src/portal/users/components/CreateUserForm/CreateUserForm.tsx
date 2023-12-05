import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  CardActions,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  RadioGroup,
  TextField,
} from '@mui/material'
import Radio from '@mui/material/Radio'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'

import { CreateUserRequest } from '@/types/auth/createUser/createUserRequest'
import { privilegesAgencyTrueValue, privilegesProjectmanagerTrueValue } from '@/types/user/constant'
import { Gender, Role } from '@/types/user/userEnum'

import { CreateUserValidationSchema } from '../../../../commons/validation/validationSchema'
import ShowPrivilegesByRoleForm from '../ShowPrivilegesByRoleForm/ShowPrivilegesByRoleForm'

const initialValues = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  phoneNumber: '',
  gender: Gender.MALE,
  role: Role.AGENCY,
  privileges: [],
}

export type CreateUserFormProps = {
  isLoading?: boolean
  onSubmit: (value: CreateUserRequest) => void
}

export default function CreateUserForm({ onSubmit }: CreateUserFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: CreateUserValidationSchema,
    onSubmit: (values) => {
      const data: CreateUserRequest =
        values.role === Role.AGENCY
          ? { ...values, privileges: [...values.privileges, ...privilegesAgencyTrueValue] }
          : { ...values, privileges: [...values.privileges, ...privilegesProjectmanagerTrueValue] }
      onSubmit(data)
    },
  })

  const toggleTypePassword = () => setShowPassword((pre) => !pre)

  const onGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event)
  }

  const usernameChange = (event: unknown) => {
    formik.setFieldTouched('username')
    formik.handleChange(event)
  }

  const passwordChange = (event: unknown) => {
    formik.setFieldTouched('password')
    formik.handleChange(event)
  }

  return (
    <Box
      noValidate
      sx={{ p: 4 }}
      component="form"
      autoComplete="off"
      onSubmit={formik.handleSubmit}
    >
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            label="First name"
            id="firstName"
            name="firstName"
            className="max-w-3xl"
            inputProps={{
              classes: 'max-w-3xl',
            }}
            sx={{ m: 1, width: '96%' }}
            size="small"
            value={formik.values.firstName}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={
              formik.touched.firstName &&
              Boolean(formik.errors.firstName) &&
              (formik.errors.firstName ?? '')
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            label="Last name"
            id="lastName"
            name="lastName"
            sx={{ m: 1, width: '96%' }}
            size="small"
            value={formik.values.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={
              formik.touched.lastName &&
              Boolean(formik.errors.lastName) &&
              (formik.errors.lastName ?? '')
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            label="Username"
            id="username"
            name="username"
            sx={{ m: 1, width: '96%' }}
            size="small"
            value={formik.values.username}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={
              formik.touched.username &&
              Boolean(formik.errors.username) &&
              (formik.errors.username ?? '')
            }
            onBlur={formik.handleBlur}
            onChange={usernameChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            label="Phone number"
            id="phoneNumber"
            name="phoneNumber"
            sx={{ m: 1, width: '96%' }}
            size="small"
            value={formik.values.phoneNumber}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={
              formik.touched.phoneNumber &&
              Boolean(formik.errors.phoneNumber) &&
              (formik.errors.phoneNumber ?? '')
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            required
            margin="normal"
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            sx={{ m: 1, width: '96%' }}
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
            onChange={passwordChange}
            onBlur={formik.handleBlur}
          />
        </Grid>
      </Grid>

      <FormControl sx={{ m: 1, width: '100%' }}>
        <FormLabel id="gender">Gender</FormLabel>
        <RadioGroup row name="gender" value={formik?.values?.gender} onChange={onGenderChange}>
          <FormControlLabel value={Gender.FEMALE} control={<Radio />} label="Female" />
          <FormControlLabel value={Gender.MALE} control={<Radio />} label="Male" />
        </RadioGroup>
      </FormControl>

      <ShowPrivilegesByRoleForm formik={formik} />

      <CardActions sx={{ justifyContent: 'center', padding: '10px', marginTop: 2 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ marginRight: 1 }}
          disabled={!formik.isValid || !formik.dirty}
        >
          ADD
        </Button>
        <Button variant="outlined" component={ReactRouterLink} to="/users">
          CANCEL
        </Button>
      </CardActions>
    </Box>
  )
}
