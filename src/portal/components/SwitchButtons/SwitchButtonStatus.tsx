import { Box, Switch, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Status } from '@/types/user/userEnum'

import AlertDeactivate from './AlertDeactivate'

interface IProps {
  id: string
  label?: string
  color?: 'primary' | 'success' | 'error' | 'info' | 'warning'
  status?: Status
  onClick?: ({ userId, newStatus }: { userId: string; newStatus: Status }) => void
  role?: string
  isSuccess: boolean
}

const SwitchButtonStatus = ({
  id,
  label,
  color = 'success',
  status,
  onClick,
  isSuccess,
}: IProps) => {
  const [isActive, setIsActive] = useState<boolean>(status === Status.ACTIVE)
  const [isOpenAlertDeActivate, setIsOpenAlertDeActivate] = useState<boolean>(false)
  const [isDeactivate, setDeactivate] = useState<boolean>(false)

  const changeStatusOfUser = () => {
    const newStatus = status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE

    if (status === Status.ACTIVE) {
      setIsOpenAlertDeActivate(true)
    } else {
      if (onClick)
        onClick({
          userId: id,
          newStatus: newStatus,
        })
    }
  }
  useEffect(() => {
    if (status === Status.ACTIVE) setIsActive(true)
    else setIsActive(false)
  }, [status])

  useEffect(() => {
    if (isSuccess) {
      const messageChangeStatusSuccessfully =
        status === Status.ACTIVE ? 'Deactived successfully !' : 'Activated successfully !'
      toast.success(messageChangeStatusSuccessfully, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }
  }, [isSuccess])
  useEffect(() => {
    if (isDeactivate && onClick) {
      const newStatus = status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE

      onClick({
        userId: id,
        newStatus: newStatus,
      })
    }
    setDeactivate(false)
  }, [isDeactivate])

  return (
    <>
      <AlertDeactivate
        setDeactivate={setDeactivate}
        isOpen={isOpenAlertDeActivate}
        setIsOpen={() => setIsOpenAlertDeActivate((prev) => !prev)}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <Switch
          color={color}
          checked={isActive}
          name={label}
          sx={{
            '& .MuiBox-root': {
              '& .MuiSwitch-switchBase': {
                color: '#818181',
                padding: '1px',
              },
              '& .MuiSwitch-thumb': {
                color: 'white',
                width: '20px',
                height: '20px',
                margin: '1px',
                borderRadius: '20px',
              },
              '& .MuiSwitch-input': {
                width: '100vh!important',
                left: '-50vh!important',
              },
            },
          }}
          inputProps={{ 'aria-label': `${label}` }}
          onChange={changeStatusOfUser}
        />
        {isActive ? (
          <Typography color="green" pl={0.5}>
            {' '}
            Activated
          </Typography>
        ) : (
          <Typography color="gray" pl={0.5}>
            {' '}
            Deactivated
          </Typography>
        )}
      </Box>
    </>
  )
}

export default SwitchButtonStatus
