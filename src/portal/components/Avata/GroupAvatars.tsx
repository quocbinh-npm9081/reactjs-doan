import AvatarGroup from '@mui/material/AvatarGroup'

import { IProjectMembers } from '@/types/project/projectResponse'

import FallbackAvatars from './FallbackAvatars'

interface IProps {
  members: IProjectMembers[]
}
export default function GroupAvatars({ members }: IProps) {
  return (
    <AvatarGroup
      max={4}
      variant="circular"
      sx={{
        '& .MuiAvatarGroup-avatar': {
          fontWeight: '700',
          fontSize: '15px',
          height: '35px',
          width: '35px',
          backgroundColor: 'unset',
          border: '0.5px solid transparent!important',
        },
      }}
    >
      {members.map((member: IProjectMembers) => (
        <FallbackAvatars
          key={member.id}
          firstName={member.firstName}
          lastName={member.lastName}
          tooltip={true}
        />
      ))}
    </AvatarGroup>
  )
}
