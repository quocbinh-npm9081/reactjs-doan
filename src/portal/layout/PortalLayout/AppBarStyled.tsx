import AppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'
/* eslint-disable  @typescript-eslint/no-explicit-any */
const drawerWidth = 240
const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})((prop: any) => ({
  zIndex: prop.theme.zIndex.drawer + 1,
  transition: prop.theme.transitions.create(['width', 'margin'], {
    easing: prop.theme.transitions.easing.sharp,
    duration: prop.theme.transitions.duration.leavingScreen,
  }),
  ...(prop?.open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: prop.theme.transitions.create(['width', 'margin'], {
      easing: prop.theme.transitions.easing.sharp,
      duration: prop.theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default AppBarStyled
