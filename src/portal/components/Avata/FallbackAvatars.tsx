import Avatar from '@mui/material/Avatar'

import { randomBackgroundColor } from '@/commons/helpers/randomBackgroundColor'

import BasicTooltip from '../Tooltip/BasicTooltip'

interface IProps {
  firstName: string
  lastName: string
  width?: string
  height?: string
  fontSize?: string
  border?: string
  tooltip?: boolean
}

export default function FallbackAvatars({
  firstName,
  lastName,
  width = '32px',
  height = '32px',
  fontSize = '12px',
  border = '0.5px solid #3e5e9f!important',
  tooltip,
}: IProps) {
  const firstWordsFirstName = firstName[0]
  const firstWordsLastname = lastName[0]
  const userName: string = `${firstWordsFirstName}${firstWordsLastname}`

  if (firstWordsFirstName === ' ' || firstWordsFirstName === undefined) {
    return (
      <Avatar
        alt={userName}
        sx={{
          fontWeight: '700',
          fontSize: fontSize,
          height: height,
          width: width,
          border: border,
          color: 'black',
          background: '#d5d5d59c',
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
          ':hover': { background: '#bababacf', cursor: 'pointer' },
        }}
      >
        +
      </Avatar>
    )
  } else {
    return (
      <>
        {tooltip ? (
          <BasicTooltip title={lastName + ' ' + firstName}>
            <Avatar
              alt={userName}
              sx={{
                fontWeight: '700',
                fontSize: fontSize,
                height: height,
                width: width,
                border: border,
                ...randomBackgroundColor(firstName),
              }}
            >
              {userName.toUpperCase()}
            </Avatar>
          </BasicTooltip>
        ) : (
          <Avatar
            alt={userName}
            sx={{
              fontWeight: '700',
              fontSize: fontSize,
              height: height,
              width: width,
              border: border,
              ...randomBackgroundColor(firstName),
            }}
          >
            {userName.toUpperCase()}
          </Avatar>
        )}
      </>
    )
  }
}
