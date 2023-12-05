import { Grid } from '@mui/material'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import {
  useGetMyInvitationsQuery,
  useResponseInvitationsMutation,
} from '@/store/invitation/invitationApi'
import { getInvitationsResponse } from '@/types/invitation/invitationResponse'

import InvitationCard from '../../components/InvitationCard/InvitationCard'

export default function Invitations() {
  const { data, isSuccess } = useGetMyInvitationsQuery()
  const [responseInvitations, result] = useResponseInvitationsMutation()

  useEffect(() => {
    if (result.isSuccess) {
      toast.success('Succcessfully')
    }
  }, [result.isSuccess])

  const handleAccept = (id: string) => {
    responseInvitations({ id: id, accept: true })
  }
  const handleReject = (id: string) => {
    responseInvitations({ id: id, accept: false })
  }

  return (
    <>
      {data === undefined && isSuccess ? <h1>List invitation</h1> : ''}
      <Grid container spacing={3} sx={{ marginTop: '1rem' }}>
        {data?.map((invitation: getInvitationsResponse) => (
          <Grid key={invitation.key} item xs={6} md={3}>
            <InvitationCard
              invitation={invitation}
              handleAccept={handleAccept}
              handleReject={handleReject}
            />
          </Grid>
        ))}
      </Grid>
    </>
  )
}
