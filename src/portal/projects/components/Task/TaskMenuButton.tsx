import { Dropdown } from '@mui/base/Dropdown'
import { Menu } from '@mui/base/Menu'
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton'
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import { useState } from 'react'

import AlertDialog from '@/portal/components/Dialogs/AlertDialog'

import { TOptions } from './Task'

interface IPropTaskMenuButton {
  taskId: string
  options: TOptions
  onToggleMenu: (isToggl: boolean) => void
  onDeleteTask: (task: string) => void
  onHiddenMenu: (isHidden: boolean) => void
}

const Listbox = styled('ul')(
  () => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: auto;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: #fff;
    border: 1px solid #DAE2ED;
    color: #1C2025;
    box-shadow: 0px 4px 6px rgba(0,0,0, 0.05);  
    z-index: 1;
    `,
)

const MenuItem = styled(BaseMenuItem)(
  () => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
    cursor: pointer;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid #99CCF3;
      background-color: #E5EAF2;
      color: #1C2025;
    }
  
    &.${menuItemClasses.disabled} {
      color: #B0B8C4;
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: #f1f2f2;
      color: #003A75;
    }
    `,
)

const MenuButton = styled(BaseMenuButton)(
  () => `
    justify-content: center;
    align-items: center;
    display: flex;
    height: 27px;
    width: 27px;
    padding: 8px 16px;
    border-radius: 75%;
    transition: all 150ms ease;
    cursor: pointer;
    background: transparent;
    color:#1C2025;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border : none;

    &:hover {
      background: #f3f3f3;
      border-color: #C7D0DD;
    }
  
    &:active {
      background: #e6caca;
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px #DAE2ED;
      outline: none;
    }
    `,
)

const TaskMenuButton = ({
  taskId,
  options,
  onToggleMenu,
  onDeleteTask,
  onHiddenMenu,
}: IPropTaskMenuButton) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const onAfterCloseDialog = () => {
    setIsOpenDialog(false), onHiddenMenu(true)
  }
  const onAfterConfirm = () => onDeleteTask(taskId)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '5px',
        right: '5px',
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <AlertDialog
        isOpen={isOpenDialog}
        title="Warning!"
        dialogContent="Are you sure you want to delete it, this action cannot be undone"
        onAfterCloseDialog={onAfterCloseDialog}
        onAfterConfirm={onAfterConfirm}
      />

      <Dropdown onOpenChange={(event, open) => onToggleMenu(open)}>
        <MenuButton>
          <DriveFileRenameOutlineIcon fontSize="small" />
        </MenuButton>
        <Menu slots={{ listbox: Listbox }}>
          {options.map((option, index) => (
            <MenuItem
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
              onClick={option.title === 'Delete' ? () => setIsOpenDialog(true) : option.onClick}
            >
              {option.iconLeft}{' '}
              <Typography sx={{ marginLeft: '12px', fontSize: '16px' }}>{option.title}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Dropdown>
    </Box>
  )
}
export default TaskMenuButton
