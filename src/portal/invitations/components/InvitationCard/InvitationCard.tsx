import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

import { formatDateTime } from '@/commons/helpers/utils'
import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { getInvitationsResponse } from '@/types/invitation/invitationResponse'

import InvitationDialog from './InvitationDialog'

interface InvitationCardProps {
  invitation: getInvitationsResponse
  handleAccept: (id: string) => void
  handleReject: (id: string) => void
}

export default function InvitationCard({
  invitation,
  handleAccept,
  handleReject,
}: InvitationCardProps) {
  const [optionButton, setOptionButton] = useState<boolean>(true)
  const [textButton, setTextButton] = useState('')
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

  const onClickAccept = () => {
    handleAccept(invitation?.id)
    setOptionButton(false)
    setTextButton('Accepted')
  }
  const onClickReject = () => {
    setIsOpenDialog(true)
  }

  const [splitFirstProjectName, setSplitFirstProjectName] = useState<string>('')
  const [splitLastProjectName, setSplitLastProjectName] = useState<string>(' ')
  useEffect(() => {
    if (invitation.projectName) {
      const splitProjectName = invitation.projectName.split(' ')
      setSplitFirstProjectName(splitProjectName[0])
      if (splitProjectName.length === 1) {
        return
      } else {
        setSplitLastProjectName(splitProjectName[splitProjectName.length - 1])
      }
    }
  }, [invitation.projectName])

  return (
    <Card
      sx={{
        display: 'inline-block',
        maxWidth: 280,
        margin: '0',
      }}
    >
      <CardMedia
        sx={{
          '& .MuiAvatar-circular': {
            borderRadius: '5px 5px 0 0',
          },
        }}
      >
        <FallbackAvatars
          firstName={splitFirstProjectName}
          lastName={splitLastProjectName}
          width="280px"
          height="140px"
          fontSize="24px"
          border="0.5px solid white!important"
        />
      </CardMedia>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {invitation.projectName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Inviter: {invitation?.inviter?.firstName} {invitation?.inviter?.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Expired time: {formatDateTime(invitation?.expiredTime)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          paddingTop: 0,
          paddingBottom: '25px',
          width: '100%',
          textAlign: 'center',
          display: optionButton ? 'inline-block' : 'none',
        }}
      >
        <Button
          size="small"
          variant="contained"
          sx={{ width: '46%', padding: '8px 0' }}
          type="submit"
          onClick={onClickAccept}
        >
          Accept
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="warning"
          sx={{ width: '46%', padding: '8px 0' }}
          onClick={onClickReject}
        >
          Reject
        </Button>
      </CardActions>
      <InvitationDialog
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
        title={'Warning!'}
        content={'Do you really want to reject the invitation to the project?'}
        id={invitation?.id}
        handleReject={handleReject}
        setOptionButton={setOptionButton}
        setTextButton={setTextButton}
      />
      <CardActions
        sx={{
          paddingTop: 0,
          paddingBottom: '25px',
          width: '100%',
          textAlign: 'center',
          display: optionButton ? 'none' : 'inline-block',
        }}
      >
        <Button disabled variant="contained" sx={{ width: '95%', height: '40.35px' }}>
          {textButton}
        </Button>
      </CardActions>
    </Card>
  )
}
