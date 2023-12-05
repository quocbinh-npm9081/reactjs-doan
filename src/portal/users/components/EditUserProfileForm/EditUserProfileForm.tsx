import {
  Box,
  Button,
  CardActions,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { UpdateUserProfileRequest } from '@/types/auth/updateUserProfile/updateUserProfileRequest'
import {
  INCORRECT_PHONE_NUMBER,
  PHONEREGEXP,
  PLEAES_ENTER_A_FIRST_NAME,
  PLEASE_ENTER_A_LAST_NAME,
} from '@/types/profile/constants'
import { UserProfile } from '@/types/profile/profileResponse'
import { Gender } from '@/types/user/userEnum'

const validationSchema = Yup.object({
  firstName: Yup.string().required(PLEAES_ENTER_A_FIRST_NAME),
  lastName: Yup.string().required(PLEASE_ENTER_A_LAST_NAME),
  phoneNumber: Yup.string().matches(PHONEREGEXP, INCORRECT_PHONE_NUMBER),
})

export type EditUserProfileFormProps = {
  isLoading?: boolean
  profile?: UserProfile
  onSubmit: (value: UpdateUserProfileRequest) => void
  isCancel: () => void
}

export default function EditUserProfileForm({
  isCancel,
  onSubmit,
  isLoading,
  profile,
}: EditUserProfileFormProps) {
  const formik = useFormik({
    initialValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      gender: profile?.gender || Gender.FEMALE,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data: UpdateUserProfileRequest = { ...values }
      onSubmit(data)
      resetForm()
    },
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event)
  }

  return (
    <>
      <Container
        component="main"
        maxWidth="sm"
        sx={{ display: 'flex!important', justifyContent: 'center', alignItems: 'center' }}
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
            alignItems: 'center',
            background: 'white',
          }}
          onSubmit={formik.handleSubmit}
        >
          <Typography component="h1" variant="h5" sx={{ m: 2 }}>
            Update Profile
          </Typography>
          <Grid container spacing={2} sx={{ padding: '0.5rem 1rem' }}>
            <Grid item md={3}>
              First name:{' '}
            </Grid>
            <TextField
              id="firstName"
              name="firstName"
              sx={{ m: 1, width: '55ch' }}
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
          <Grid container spacing={2} sx={{ padding: '0.5rem 1rem' }}>
            <Grid item md={3}>
              Last name:{' '}
            </Grid>
            <TextField
              id="lastName"
              name="lastName"
              sx={{ m: 1, width: '55ch' }}
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
          <Grid container spacing={2} sx={{ padding: '0.5rem 1rem' }}>
            <Grid item md={3}>
              Phone:{' '}
            </Grid>
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              sx={{ m: 1, width: '55ch' }}
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
          <FormControl sx={{ marginRight: 'auto', padding: '0.5rem 0 0 1rem' }}>
            <Grid>Gender</Grid>
            <RadioGroup
              row
              name="gender"
              id="gender"
              value={formik.values.gender}
              onChange={handleChange}
            >
              <FormControlLabel value={Gender.FEMALE} control={<Radio />} label="Female" />
              <FormControlLabel value={Gender.MALE} control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>

          <CardActions sx={{ justifyContent: 'center', padding: '10px', marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !formik.isValid || !formik.dirty}
            >
              SAVE
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                isCancel()
              }}
            >
              CANCEL
            </Button>
          </CardActions>
        </Box>
      </Container>
    </>
  )
}
