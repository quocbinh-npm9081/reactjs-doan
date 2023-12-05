import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material'
import { FormikValues } from 'formik'

import {
  privilegesAgencyFalse,
  privilegesAgencyTrue,
  privilegesProjectmanagerFalse,
  privilegesProjectmanagerTrue,
} from '@/types/user/constant'
import { Role } from '@/types/user/userEnum'

export default function ShowPrivilegesByRoleForm({ formik }: { formik: FormikValues }) {
  const onRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('privileges', [])
    formik.handleChange(event)
  }

  return (
    <>
      <FormControl sx={{ m: 1 }}>
        <FormLabel id="role">Role</FormLabel>
        <RadioGroup row name="role" value={formik?.values?.role} onChange={onRoleChange}>
          <FormControlLabel value={Role.AGENCY} control={<Radio />} label="Agency" />
          <FormControlLabel
            value={Role.PROJECT_MANAGER}
            control={<Radio />}
            label="Project manager"
          />
        </RadioGroup>
      </FormControl>

      <FormControl sx={{ m: 1, display: 'block' }}>
        <FormLabel required component="legend">
          Privileges
        </FormLabel>
        {formik.values.role === Role.AGENCY && (
          <Grid container spacing={0}>
            {privilegesAgencyTrue.map((opt) => (
              <Grid key={opt.value} item xs={12} md={6}>
                <FormControlLabel
                  disabled
                  checked
                  control={
                    <Checkbox value={opt.value} name="privileges" onChange={formik.handleChange} />
                  }
                  label={opt.label}
                />
              </Grid>
            ))}
            {privilegesAgencyFalse.map((opt) => (
              <Grid key={opt.value} item xs={12} md={6}>
                <FormControlLabel
                  checked={formik.values.privileges.includes(opt.value)}
                  control={
                    <Checkbox value={opt.value} name="privileges" onChange={formik.handleChange} />
                  }
                  label={opt.label}
                />
              </Grid>
            ))}
            {formik.touched.privileges && Boolean(formik.errors.privileges) && (
              <FormHelperText sx={{ color: '#d32f2f', m: 0 }}>
                {formik.touched.privileges &&
                  Boolean(formik.errors.privileges) &&
                  (formik.errors.privileges ?? '')}
              </FormHelperText>
            )}
          </Grid>
        )}
        {formik.values.role === Role.PROJECT_MANAGER && (
          <Grid container spacing={0}>
            {privilegesProjectmanagerTrue.map((opt) => (
              <Grid key={opt.value} item xs={12} md={6}>
                <FormControlLabel
                  disabled
                  checked
                  control={
                    <Checkbox value={opt.value} name="privileges" onChange={formik.handleChange} />
                  }
                  label={opt.label}
                />
              </Grid>
            ))}
            {privilegesProjectmanagerFalse.map((opt) => (
              <Grid key={opt.value} item xs={12} md={6}>
                <FormControlLabel
                  checked={formik.values.privileges.includes(opt.value)}
                  control={
                    <Checkbox value={opt.value} name="privileges" onChange={formik.handleChange} />
                  }
                  label={opt.label}
                />
              </Grid>
            ))}
            {formik.touched.privileges && Boolean(formik.errors.privileges) && (
              <FormHelperText sx={{ color: '#d32f2f', m: 0 }}>
                {formik.touched.privileges &&
                  Boolean(formik.errors.privileges) &&
                  (formik.errors.privileges ?? '')}
              </FormHelperText>
            )}
          </Grid>
        )}
      </FormControl>
    </>
  )
}
