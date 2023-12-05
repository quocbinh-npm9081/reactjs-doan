import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useUpdateProfileMutation } from '@/store/invitation/invitationApi'
import { UpdateUserProfileRequest } from '@/types/invitation/invitationRequest'

import UpdateProfileUserForm from '../../components/UpdateProfileUserForm/UpdateProfileUserForm'

export default function UpdateProfileUserPage() {
  const navigate = useNavigate()
  const [updateProfile, updateResult] = useUpdateProfileMutation()

  const onSubmit = (dataRequest: UpdateUserProfileRequest) => {
    updateProfile(dataRequest)
  }

  useEffect(() => {
    if (updateResult.isSuccess) {
      toast.success('Update succcessfully')
      navigate('/sign-in')
    }
  }, [updateResult.isSuccess])

  return <UpdateProfileUserForm isLoading={updateResult?.isLoading} onSubmit={onSubmit} />
}
