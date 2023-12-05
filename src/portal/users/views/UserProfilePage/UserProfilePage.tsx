import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Button, CardActions } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as ReactRouterLink } from 'react-router-dom'
import { toast } from 'react-toastify'

import EditUserProfileForm from '@/portal/users/components/EditUserProfileForm/EditUserProfileForm'
import ShowUserForm from '@/portal/users/components/ShowUserForm/ShowUserForm'
import { updateAuthInfo } from '@/store/auth/authSlice'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '@/store/profile/profileApi'
import { useProfile } from '@/store/profile/useProfile'
import { UpdateUserProfileRequest } from '@/types/auth/updateUserProfile/updateUserProfileRequest'
import { Privilege } from '@/types/user/userEnum'

export default function UserProfilePage() {
  const [viewProfile, setViewProfile] = useState(true)

  const [updateProfile, updateResult] = useUpdateUserProfileMutation()

  const profile = useProfile()
  const profile1 = useGetUserProfileQuery()

  const onSubmit = (dataRequest: UpdateUserProfileRequest) => {
    updateProfile(dataRequest)
    setViewProfile(true)
    toast.success('Update succcessfully')
  }
  const dispatch = useDispatch()

  useEffect(() => {
    if (updateResult?.isSuccess) {
      dispatch(updateAuthInfo(profile))
    }
  }, [updateResult?.isSuccess, dispatch, profile])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  useEffect(() => {
    profile1?.refetch()
  }, [])
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>User Profile</h1>
        <div>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            startIcon={<MoreVertIcon />}
            sx={{ marginTop: '30px' }}
            onClick={handleClick}
          ></Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            onClose={handleClose}
          >
            <MenuItem component={ReactRouterLink} to="/change-email-confirm">
              Change email
            </MenuItem>
            <MenuItem component={ReactRouterLink} to="/change-password">
              Change password
            </MenuItem>
          </Menu>
        </div>
      </div>

      {viewProfile && profile && profile.privileges?.includes(Privilege.VIEW_PROFILE) ? (
        <>
          <ShowUserForm profile={profile} />
          <CardActions sx={{ justifyContent: 'right', padding: '10px', marginTop: 1 }}>
            {profile.privileges?.includes(Privilege.UPDATE_PROFILE) && (
              <Button
                variant="contained"
                disabled={!profile.privileges?.includes(Privilege.UPDATE_PROFILE)}
                onClick={() => {
                  setViewProfile(false)
                }}
              >
                Edit
              </Button>
            )}
          </CardActions>
        </>
      ) : (
        <>
          {profile.privileges?.includes(Privilege.UPDATE_PROFILE) && (
            <EditUserProfileForm
              isCancel={() => setViewProfile(true)}
              isLoading={updateResult?.isLoading}
              profile={profile}
              onSubmit={onSubmit}
            />
          )}
        </>
      )}
    </>
  )
}
