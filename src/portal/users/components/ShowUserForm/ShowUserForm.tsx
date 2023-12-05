import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { UserProfile } from '@/types/profile/profileResponse'
import { Status } from '@/types/user/userEnum'

import SwitchButtonStatus from '../../../components/SwitchButtons/SwitchButtonStatus'

type ShowUserFormProps = {
  profile: UserProfile
  isSuccess?: boolean
  handleChangeStatus?: ({ userId, newStatus }: { userId: string; newStatus: Status }) => void
  statusUserResponse?: Status
}

export default function ShowUserForm({
  profile,
  isSuccess,
  handleChangeStatus,
  statusUserResponse,
}: ShowUserFormProps) {
  const { pathname } = useLocation()
  const currentStatus = profile?.status
  const [status, setStatus] = useState<Status | undefined>(currentStatus)

  useEffect(() => {
    if (statusUserResponse) setStatus(statusUserResponse)
  }, [statusUserResponse])

  return (
    profile && (
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
        position="relative"
      >
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', padding: '1rem' }}>
            <CardMedia
              sx={{
                height: 128,
                width: 128,
                borderRadius: 50,
                margin: '0 auto',
                marginTop: '1.5rem',
              }}
              image="https://i.pinimg.com/564x/63/98/33/6398330f9f05e4d81586e9230d7b8b2d.jpg"
              title={profile?.username}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {profile?.firstName + ' ' + profile?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                {profile?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.role}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ padding: 2 }}>
            <Grid>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={4} md={3}>
                  First name:{' '}
                </Grid>
                <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                  {profile?.firstName}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={4} md={3}>
                  Last name:{' '}
                </Grid>
                <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                  {profile?.lastName}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={4} md={3}>
                  Gender:{' '}
                </Grid>
                <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                  {profile?.gender}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={4} md={3}>
                  Phone:{' '}
                </Grid>
                <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                  {profile?.phoneNumber}
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={4} md={3}>
                  Email:{' '}
                </Grid>
                <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                  {profile?.username}
                </Grid>
              </Grid>
              {pathname !== '/profile' && (
                <Grid container spacing={2} sx={{ padding: 2 }}>
                  <Grid item xs={4} md={3}>
                    Status:{' '}
                  </Grid>
                  <Grid item xs={4} md={4} color="text.secondary" style={{ paddingLeft: 0 }}>
                    <SwitchButtonStatus
                      id={String(profile.id)}
                      role={profile.role}
                      isSuccess={Boolean(isSuccess)}
                      status={status}
                      onClick={handleChangeStatus}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    )
  )
}
