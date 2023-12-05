import { Dashboard, SupervisedUserCircleOutlined } from '@mui/icons-material'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Toolbar,
  Typography,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MenuItem from '@mui/material/MenuItem'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as ReactRouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useCurrentPath } from '@/commons/useCurrentPath'
import { signOut } from '@/store/auth/authSlice'
import { useAuth } from '@/store/auth/useAuth'
import { Role } from '@/types/user/userEnum'

import AppBarStyled from './AppBarStyled'

const drawerWidth = 240

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

export default function PortalLayout() {
  const navigate = useNavigate()
  const auth = useAuth()
  const mdTheme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  })
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch()
  const toggleDrawer = () => {
    setOpen(!open)
  }

  const handleResize = () => {
    if (window.innerWidth < 1024) setOpen(false)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize, false)
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const { pathname } = useLocation()

  const currentPathProjectId = useCurrentPath({ path: '/projects/:id' })
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSignOut = () => {
    dispatch(signOut())
  }
  const handleProfile = () => {
    setAnchorEl(null)
    setTimeout(() => {
      navigate('/profile')
    }, 300)
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarStyled position="absolute">
          <Toolbar
            sx={{
              pr: '24px',
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography noWrap component="h1" variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
              React Starter
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleClick}
              >
                <AccountCircleOutlinedIcon fontSize="inherit" />
              </IconButton>
              <Menu
                keepMounted
                id="menu-appbar"
                anchorEl={anchorEl}
                open={openMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={handleClose}
              >
                <MenuItem sx={{ padding: '10px 30px' }} onClick={handleProfile}>
                  Profile
                </MenuItem>
                <MenuItem sx={{ padding: '10px 30px' }} onClick={handleSignOut}>
                  Log out
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBarStyled>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Typography
              noWrap
              variant="h6"
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.075rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              React Starter
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <ListItemButton component={ReactRouterLink} to="/dashboard">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {auth.role === Role.ADMINISTRATOR && (
              <ListItemButton component={ReactRouterLink} to="/users">
                <ListItemIcon>
                  <SupervisedUserCircleOutlined />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            )}
            <ListItemButton component={ReactRouterLink} to="/projects">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Projects" />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: pathname === '/users' ? 'hidden' : 'auto',
          }}
        >
          <Toolbar />
          <Container
            maxWidth="xl"
            sx={{
              maxWidth: currentPathProjectId ? '100%!important' : 'unset',
              pl: currentPathProjectId ? '0px!important' : 1,
              pr: currentPathProjectId ? '0px!important' : 1,
              overflow: currentPathProjectId ? 'hidden!important' : 'auto',
            }}
          >
            <Outlet></Outlet>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
