import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import {
  PASSWORD_AT_LEAST_9_CHARACTER,
  PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL,
  PASSWORD_IS_REQUIRE,
  REGEX_VALID_PASSWORD,
} from '@/types/auth/constants'
import { UpdateUserProfileRequest } from '@/types/invitation/invitationRequest'
import {
  INCORRECT_PHONE_NUMBER,
  PHONEREGEXP,
  PLEAES_ENTER_A_FIRST_NAME,
  PLEASE_ENTER_A_LAST_NAME,
  PLEASE_ENTER_PHONE_NUMBER,
} from '@/types/profile/constants'
import { Gender } from '@/types/user/userEnum'

const validationSchema = Yup.object({
  firstName: Yup.string().required(PLEAES_ENTER_A_FIRST_NAME),
  lastName: Yup.string().required(PLEASE_ENTER_A_LAST_NAME),
  password: Yup.string()
    .required(PASSWORD_IS_REQUIRE)
    .min(9, PASSWORD_AT_LEAST_9_CHARACTER)
    .matches(REGEX_VALID_PASSWORD, PASSWORD_AT_LESAT_1_CAPITAL_AND_1_SPECIAL),
  phoneNumber: Yup.string()
    .matches(PHONEREGEXP, INCORRECT_PHONE_NUMBER)
    .required(PLEASE_ENTER_PHONE_NUMBER),
})

export type EditUserProfileFormProps = {
  isLoading?: boolean
  onSubmit: (value: UpdateUserProfileRequest) => void
}

export default function UpdateProfileUserForm({ onSubmit, isLoading }: EditUserProfileFormProps) {
  const { id } = useParams()

  const formik = useFormik({
    initialValues: {
      key: id || '',
      firstName: '',
      lastName: '',
      password: '',
      phoneNumber: '',
      gender: Gender.FEMALE,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data: UpdateUserProfileRequest = { ...values }
      onSubmit(data)
      resetForm()
    },
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const toggleTypePassword = () => setShowPassword((pre) => !pre)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event)
  }

  const passwordChange = (event: unknown) => {
    formik.setFieldTouched('password')
    formik.handleChange(event)
  }

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex!important',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
      }}
    >
      <Box
        noValidate
        component="form"
        autoComplete="off"
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
        }}
        onSubmit={formik.handleSubmit}
      >
        <Typography component="h1" variant="h5" sx={{ m: 2, textAlign: 'center' }}>
          Update profile
        </Typography>
        <Grid container spacing={0} sx={{ padding: '0.5rem 1rem', justifyContent: 'center' }}>
          <Grid item xs={12} md={12}>
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
          <Grid item xs={12} md={12}>
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
          <Grid item xs={12} md={12}>
            <TextField
              required
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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
          <Grid item xs={12} md={12}>
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
        </Grid>

        <FormControl sx={{ width: '100%', margin: '0 1.6rem' }}>
          <FormLabel id="gender">Gender</FormLabel>
          <RadioGroup row name="gender" value={formik?.values?.gender} onChange={handleChange}>
            <FormControlLabel value={Gender.FEMALE} control={<Radio />} label="Female" />
            <FormControlLabel value={Gender.MALE} control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          sx={{ width: '90%', margin: '1rem auto', marginTop: '1.5rem' }}
          disabled={isLoading || !formik.isValid || !formik.dirty}
        >
          SAVE
        </Button>
        <Box sx={{ with: '100%', margin: '0 1.6rem' }}>
          <Link to="/sign-in">
            <Typography gutterBottom variant="body1" display="block">
              Back to sign in
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  )
}
