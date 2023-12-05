import { Alert, Box, Container, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAddUserMutation } from '@/store/user/userApi'
import { MESSAGE_USERNAME_ALREADY_EXISTS } from '@/types/auth/constants'
import { CreateUserRequest } from '@/types/auth/createUser/createUserRequest'
import { EmessageResponse } from '@/types/auth/createUser/createUserResponse'
import { IDataResponse } from '@/types/BaseResponse'

import CreateUserForm from '../../components/CreateUserForm/CreateUserForm'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const [addUser, { isLoading, error, isSuccess, isError }] = useAddUserMutation()
  const onSubmit = (dataRequest: CreateUserRequest) => {
    addUser(dataRequest)
  }

  const errorResponse = { ...error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.usernameAlreadyExists]: MESSAGE_USERNAME_ALREADY_EXISTS,
  }

  const messageErr = errorCode ? customMessages[errorCode] : ''

  useEffect(() => {
    if (isSuccess) {
      toast.success('Create user succcessfully')
      navigate('/users')
    }
  }, [isSuccess, navigate])

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ display: 'flex!important', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'white',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ pt: 4 }}>
          Create User
        </Typography>
        {isError && (
          <Alert
            severity="error"
            className="mb-2"
            sx={{
              width: '90%!important',
              marginTop: '10px',
              marginBottom: '10px',
            }}
          >
            {messageErr}
          </Alert>
        )}
        <CreateUserForm isLoading={isLoading} onSubmit={onSubmit} />
      </Box>
    </Container>
  )
}
