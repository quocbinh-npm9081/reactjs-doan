import { Button, CardActions } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useUpdateStatusUserProfileMutation } from '@/store/profile/profileApi'
import { useGetUserQuery, useUpdateUserMutation } from '@/store/user/userApi'
import { UpdateUserProfileRequest } from '@/types/auth/updateUserProfile/updateUserProfileRequest'
import { UserProfile } from '@/types/profile/profileResponse'
import { Status } from '@/types/user/userEnum'

import EditDetailUserForm from '../../components/EditDetailUserForm/EditDetailUserForm'
import ShowUserForm from '../../components/ShowUserForm/ShowUserForm'

export default function UserDetailPage() {
  const params = useParams()
  const id: string = String(params.id)
  const { data } = useGetUserQuery(id)
  const navigate = useNavigate()
  const [viewProfile, setViewProfile] = useState(true)
  const [userDetail, setUserDetail] = useState<UserProfile>()
  const [updateUser, updateResult] = useUpdateUserMutation()
  const [updateStatusUser, updateStatusUserResult] = useUpdateStatusUserProfileMutation()

  const onSubmit = (dataRequest: UpdateUserProfileRequest) => {
    if (id) {
      updateUser({ id: id, user: dataRequest })
      setViewProfile(true)
    }
  }

  const handleChangeStatus = ({ userId, newStatus }: { userId: string; newStatus: Status }) => {
    updateStatusUser({
      userId: userId,
      newStatus: newStatus,
    })
  }
  const handleBack = () => {
    navigate('/users')
  }

  useEffect(() => {
    if (updateResult?.isSuccess) {
      toast.success('Update succcessfully')
    }
  }, [updateResult?.isSuccess])

  useEffect(() => {
    if (updateResult?.data) {
      setUserDetail(updateResult?.data)
    }
  }, [updateResult?.data?.username])

  useEffect(() => {
    if (data) {
      setUserDetail(data)
    }
  }, [data?.username])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Detail user</h1>
      </div>

      {viewProfile && userDetail ? (
        <>
          <ShowUserForm
            profile={userDetail}
            handleChangeStatus={handleChangeStatus}
            isSuccess={updateStatusUserResult.isSuccess}
            statusUserResponse={updateStatusUserResult.data?.status}
          />
          <CardActions sx={{ justifyContent: 'right', padding: '10px', marginTop: 1 }}>
            <Button
              variant="contained"
              sx={{ marginRight: 1 }}
              onClick={() => {
                setViewProfile(false)
              }}
            >
              Edit
            </Button>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </CardActions>
        </>
      ) : (
        <EditDetailUserForm
          isCancel={() => setViewProfile(true)}
          isLoading={updateResult?.isLoading}
          user={userDetail}
          onSubmit={onSubmit}
        />
      )}
    </>
  )
}
