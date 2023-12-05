import { Dropdown } from '@mui/base/Dropdown'
import { Menu } from '@mui/base/Menu'
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton'
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box } from '@mui/material'
import { styled } from '@mui/system'
import { useEffect, useState } from 'react'

interface IPropStageMenuButton {
  options: TOption[]
}
type TOption = {
  title: string
  onClick?: () => void
}
const Listbox = styled('ul')(
  () => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
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
      color: #000;
    }
    `,
)
const MenuButton = styled(BaseMenuButton)(
  () => `
    justify-content: center;
    align-items: center;
    display: flex;
    height: 37px;
    width: 37px;
    padding: 8px 16px;
    border-radius: 100%;
    transition: all 150ms ease;
    cursor: pointer;
    background: transparent;
    color:#1C2025;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border : none;
    &:hover {
      background: #7fd3bf;
      border-color: '#C7D0DD';
    }
  
    &:active {
      background: #7fd3bf;
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px #DAE2ED;
      outline: none;
    }
    `,
)
const StageMenuButton = ({ options }: IPropStageMenuButton) => {
  const [items, setItems] = useState<TOption[]>(options)

  const handleClickMenuItem = (item: TOption) => {
    if (item.onClick) item.onClick()
  }
  useEffect(() => {
    const items = options.filter((option) => option.onClick)
    setItems(items)
  }, [options])

  return (
    <Box>
      <Dropdown>
        <MenuButton>
          {' '}
          <MoreVertIcon />
        </MenuButton>
        <Menu slots={{ listbox: Listbox }}>
          {items.map((option, index) => (
            <MenuItem key={index} onClick={() => handleClickMenuItem(option)}>
              {option.title}
            </MenuItem>
          ))}
        </Menu>
      </Dropdown>
    </Box>
  )
}
export default StageMenuButton
