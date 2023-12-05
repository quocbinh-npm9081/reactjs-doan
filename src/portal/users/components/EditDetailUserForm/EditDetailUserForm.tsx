import {
  Box,
  Button,
  CardActions,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { PRIVILEGES_FIELD_MUST_HAVE_AT_LEAST_1_ITEMS } from '@/commons/auth.constant'
import {
  INCORRECT_PHONE_NUMBER,
  PHONEREGEXP,
  PLEAES_ENTER_A_FIRST_NAME,
  PLEASE_ENTER_A_LAST_NAME,
} from '@/types/profile/constants'
import { UserProfile } from '@/types/profile/profileResponse'
import { privilegesAgencyTrueValue, privilegesProjectmanagerTrueValue } from '@/types/user/constant'
import { Gender, Role } from '@/types/user/userEnum'
import { UpdateUserRequest } from '@/types/user/userRequest'
import { UpdateUseReponse } from '@/types/user/userResponse'

import ShowPrivilegesByRoleForm from '../ShowPrivilegesByRoleForm/ShowPrivilegesByRoleForm'

const validationSchema = Yup.object({
  firstName: Yup.string().required(PLEAES_ENTER_A_FIRST_NAME),
  lastName: Yup.string().required(PLEASE_ENTER_A_LAST_NAME),
  phoneNumber: Yup.string().matches(PHONEREGEXP, INCORRECT_PHONE_NUMBER),
  privileges: Yup.array().min(1, PRIVILEGES_FIELD_MUST_HAVE_AT_LEAST_1_ITEMS),
})

export type EditUserProfileFormProps = {
  isLoading?: boolean
  user?: UserProfile | undefined
  onSubmit: (value: UpdateUserRequest) => void
  isCancel: () => void
}

export default function EditDetailUserForm({
  isCancel,
  onSubmit,
  isLoading,
  user,
}: EditUserProfileFormProps) {
  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || Gender.MALE,
      role: (user?.role as Role) || Role.AGENCY,
      privileges: user?.privileges || [],
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data: UpdateUseReponse =
        values.role === Role.AGENCY
          ? { ...values, privileges: [...values.privileges, ...privilegesAgencyTrueValue] }
          : { ...values, privileges: [...values.privileges, ...privilegesProjectmanagerTrueValue] }
      onSubmit(data)
      resetForm()
    },
  })

  const onGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event)
  }

  return (
    <>
      <Container
        component="main"
        maxWidth="md"
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
            background: 'white',
          }}
          onSubmit={formik.handleSubmit}
        >
          <Typography component="h1" variant="h5" sx={{ m: 2, textAlign: 'center' }}>
            Update User
          </Typography>
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
                disabled
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
                onChange={formik.handleChange}
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
          </Grid>

          <FormControl sx={{ m: 1, width: '100%' }}>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              id="gender"
              value={formik?.values?.gender}
              onChange={onGenderChange}
            >
              <FormControlLabel value={Gender.FEMALE} control={<Radio />} label="Female" />
              <FormControlLabel value={Gender.MALE} control={<Radio />} label="Male" />
            </RadioGroup>
          </FormControl>

          <ShowPrivilegesByRoleForm formik={formik} />

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
