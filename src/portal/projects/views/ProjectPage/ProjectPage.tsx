import { EditOutlined } from '@mui/icons-material'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'
// eslint-disable-next-line import/named
import { useDebounce } from '@uidotdev/usehooks'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { firstUpercase } from '@/commons/helpers/utils'
import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import GroupAvatars from '@/portal/components/Avata/GroupAvatars'
import FormProjectDialog, {
  TtextFields,
} from '@/portal/components/FormProjectDialog/FormProjectDialog'
import KanbanBoard from '@/portal/projects/views/KanbanBoard/KanbanBoard'
import { useAuth } from '@/store/auth/useAuth'
import {
  useAddAgencyInProjectMutation,
  useAddInvitationsMutation,
  useGetProjectByIdQuery,
  useGetProjectMemberQuery,
  useGetProjectStagesQuery,
  useUpdateProjectMutation,
} from '@/store/project/projectApi'
import { useGetAutocompleteUsersQuery } from '@/store/user/userApi'
import { REGEX_VALID_EMAIL } from '@/types/auth/constants'
import { PLEASE_ENTER_EMAIL_OR_USERNAME } from '@/types/project/constants'
import { TypeFormProject } from '@/types/project/projectEnum'
import { IMyProject, IProjectMembers, TStage } from '@/types/project/projectResponse'
import { Privilege, Role, Status } from '@/types/user/userEnum'
import { UsersAutocompleteResponse } from '@/types/user/userResponse'

const optionsRole = [Role.TALENT, Role.AGENCY]
const validationSchema = Yup.object({
  emails: Yup.array().required(PLEASE_ENTER_EMAIL_OR_USERNAME),
})

const validationSchemaProject = Yup.object({
  name: Yup.string().required('Name of the project is required'),
  description: Yup.string().max(150, 'Description no more than 150 characters !'),
})

const textFieldsFormCreateProject: TtextFields[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'email',
    variant: 'outlined',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    variant: 'outlined',
    multiline: true,
    minRows: 3,
  },
]

function ProjectAppBar({
  dataProject,
  setSkipGetProjectById,
  setMemberData,
}: {
  dataProject: IMyProject
  setSkipGetProjectById: (value: boolean) => void
  members: IProjectMembers[] | undefined
  setMemberData: (value: IProjectMembers[]) => void | undefined
}) {
  const [addAgencyInProject, addAgencyResult] = useAddAgencyInProjectMutation()
  const [addInvitations, addInvitationsResult] = useAddInvitationsMutation()

  const [skipGetMember, setSkipGetMember] = useState<boolean>(false)
  const { data, isSuccess } = useGetProjectMemberQuery(dataProject.id, { skip: skipGetMember })
  useEffect(() => {
    if (isSuccess) {
      setMemberData(data)
    }
  }, [isSuccess])

  const auth = useAuth()

  const formik = useFormik({
    initialValues: {
      id: dataProject.id,
      emails: [],
    },
    validationSchema: validationSchema,
    onSubmit: (users: { id: string; emails: UsersAutocompleteResponse[] }, { resetForm }) => {
      const inputData = { id: users.id, emails: users.emails.map((x) => x.username) }
      if (role === Role.AGENCY) {
        setSkipGetMember(true)
        addAgencyInProject(inputData)
        resetForm()
      } else {
        setSkipGetMember(true)
        addInvitations(inputData)
        resetForm()
      }
    },
  })

  useEffect(() => {
    if (addAgencyResult?.isSuccess) {
      setOpenDialog(false)
      toast.success('Share succcessfully')
      setSkipGetMember(false)
    }
  }, [addAgencyResult?.isSuccess])

  useEffect(() => {
    if (addInvitationsResult?.isSuccess) {
      setOpenDialog(false)
      toast.success('Share succcessfully')
      setSkipGetMember(false)
    }
  }, [addInvitationsResult?.isSuccess])

  const [role, setRole] = useState(Role.TALENT)

  const [open] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [currentData, setCurrentData] = useState([])

  const [memberOptions, setMemberOptions] = useState<UsersAutocompleteResponse[]>([])
  const debouncedSearchName = useDebounce(inputValue, 300)
  const getUserResult = useGetAutocompleteUsersQuery({
    keyword: debouncedSearchName,
    role: role,
  })

  useEffect(() => {
    if (getUserResult?.isSuccess) {
      let optionData = getUserResult?.data
      if (
        role === Role.TALENT &&
        inputValue.toString().match(REGEX_VALID_EMAIL) &&
        !formik.values.emails.some((x) => x?.username === inputValue)
      ) {
        optionData = [
          {
            username: inputValue,
            firstName: '',
            lastName: '',
          },
        ]
      }

      const filterData = optionData.filter((x: UsersAutocompleteResponse) => {
        if (data?.some((i) => i.email === x.username)) return false
        return true
      })

      setMemberOptions(filterData)
    }
  }, [getUserResult, inputValue])

  useEffect(() => {
    if (!open) {
      setCurrentData(currentData)
    }
  }, [open])
  useEffect(() => {
    if (data) {
      const filterData = memberOptions.filter((x) => {
        if (data?.some((i) => i.email === x.username)) return false
        return true
      })

      setMemberOptions(filterData)
    }
  }, [data])

  const handleChange = (event: React.SyntheticEvent, value: UsersAutocompleteResponse[]) => {
    formik.setFieldValue('emails', value)
    return
  }

  const handleBlur = () => {
    formik.handleBlur
    setInputValue('')
  }
  const handleFocus = () => {
    setMemberOptions([])
  }

  const [openDialog, setOpenDialog] = useState(false)
  const handleDialogOpen = () => {
    setOpenDialog(true)
  }
  const handleDialogClose = () => {
    setOpenDialog(false)
    setSelectedIndex(0)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const openMenu = Boolean(anchorEl)
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndex(index)
    setAnchorEl(null)
    setRole(optionsRole[index])
    formik.setFieldValue('emails', [])
    setMemberOptions([])
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const [initialValues, setInitialValues] = useState({
    id: dataProject?.id,
    name: dataProject?.name,
    description: dataProject?.description ? dataProject?.description : '',
  })

  useEffect(() => {
    setInitialValues({
      id: dataProject?.id,
      name: dataProject?.name,
      description: dataProject?.description ? dataProject?.description : '',
    })
  }, [dataProject.id, dataProject.name, dataProject.description])

  const [updateProject, resultUpdateProject] = useUpdateProjectMutation()
  const [OpenUpdateProjectDialog, setOpenUpdateProjectDialog] = useState<boolean>(false)
  const clickOpenUpdateProjectDialog = () => {
    setOpenUpdateProjectDialog(true)
    setSkipGetProjectById(true)
  }
  const submitUpdataProject = (values: Record<string, string>) => {
    setSkipGetProjectById(true)
    updateProject({
      project: {
        name: values.name,
        description: values.description ? values.description : undefined,
        status: dataProject.status,
      },
      id: dataProject.id,
    })
  }

  useEffect(() => {
    if (resultUpdateProject.isSuccess) {
      setOpenUpdateProjectDialog(false)
      toast.success('Update succcessfully')
      setSkipGetProjectById(false)
    }
  }, [resultUpdateProject.isSuccess])

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: '#385ca7de!important',
      }}
    >
      <Box padding={1}>
        <Toolbar
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
          }}
        >
          <Typography
            noWrap
            variant="h6"
            sx={{
              mr: 2,
              display: { md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {dataProject.name}
            {auth.authorities?.includes(Privilege.UPDATE_PROJECT) && (
              <Button sx={{ padding: 0 }} onClick={clickOpenUpdateProjectDialog}>
                <EditOutlined
                  fontSize="medium"
                  sx={{
                    color: 'white',
                    ':hover': { cursor: 'pointer' },
                  }}
                />
              </Button>
            )}
            <FormProjectDialog
              textFields={textFieldsFormCreateProject}
              initialValues={initialValues}
              validationSchema={validationSchemaProject}
              title={TypeFormProject.UPDATE_PROJECT}
              isOpen={OpenUpdateProjectDialog}
              setIsOpen={setOpenUpdateProjectDialog}
              error={resultUpdateProject.error}
              isError={resultUpdateProject.isError}
              enableResetForm={false}
              onSubmit={submitUpdataProject}
            />
          </Typography>

          <Box sx={{ flexGrow: 1 }}>
            <Box display="flex" justifyContent="flex-end">
              {isSuccess && data && <GroupAvatars members={data} />}
              {auth.authorities?.includes(Privilege.CREATE_INVITATION) && (
                <Button
                  variant="contained"
                  sx={{
                    marginLeft: '20px',
                    backgroundColor: '#dfe1e6',
                    ':hover': {
                      bgcolor: 'white',
                    },
                  }}
                  onClick={handleDialogOpen}
                >
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <PersonAddAltIcon
                      fontSize="medium"
                      sx={{ paddingRight: '5px', paddingBottom: '1.5px', color: '#172b4d' }}
                    />
                    <Typography color="#172b4d" textTransform="capitalize">
                      Share
                    </Typography>
                  </Box>
                </Button>
              )}

              <Dialog
                open={openDialog}
                sx={{ '& .MuiDialog-paper': { maxWidth: '700px' } }}
                onClose={handleDialogClose}
              >
                <Box noValidate component="form" autoComplete="off" onSubmit={formik.handleSubmit}>
                  <DialogTitle sx={{ paddingTop: '20px', paddingBottom: 0, fontSize: '24px' }}>
                    Share board
                  </DialogTitle>
                  <DialogContent sx={{ paddingBottom: '25px' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={7}>
                        <Autocomplete
                          multiple
                          limitTags={2}
                          id="emails"
                          noOptionsText={
                            role === Role.AGENCY
                              ? 'No option.'
                              : 'Add their email address to invite them.'
                          }
                          value={formik?.values?.emails}
                          options={memberOptions}
                          getOptionLabel={(option) => option?.username}
                          getOptionDisabled={(option) =>
                            (role == Role.AGENCY && option?.status !== Status.ACTIVE) ||
                            (role == Role.TALENT && option?.status === Status.INACTIVE)
                          }
                          isOptionEqualToValue={(option, value) => {
                            return option?.username === value?.username
                          }}
                          filterSelectedOptions={true}
                          renderOption={(props, option) => {
                            return (
                              option && (
                                <li {...props} key={option?.username} style={{ display: 'block' }}>
                                  {option?.firstName} {option?.lastName}{' '}
                                  {option?.status ? '(' + firstUpercase(option?.status) + ')' : ''}
                                  <span
                                    style={{ color: 'grey', margin: '5px 0', display: 'block' }}
                                  >
                                    {option?.username}
                                  </span>
                                </li>
                              )
                            )
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Email address or name"
                              margin="dense"
                              id="inputValue"
                              name="inputValue"
                              type="email"
                              variant="standard"
                              sx={{
                                width: 500,
                                maxWidth: '100%',
                              }}
                            />
                          )}
                          onInputChange={async (event, newInputValue) => {
                            if (event.type == 'change') {
                              setInputValue(newInputValue)
                            }
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onFocus={handleFocus}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <List
                          component="nav"
                          aria-label="Device settings"
                          sx={{
                            bgcolor: 'background.paper',
                            paddingTop: '1rem',
                            paddingBottom: 0,
                          }}
                        >
                          <ListItem
                            id="lock-button"
                            aria-haspopup="listbox"
                            aria-controls="lock-menu"
                            aria-label="when device is locked"
                            aria-expanded={openMenu ? 'true' : undefined}
                            sx={{
                              background: '#e5e5e5',
                              borderRadius: '5px',
                              ':hover': { background: '#bdbdbd' },
                            }}
                            onClick={handleClickListItem}
                          >
                            <ListItemText
                              secondary={optionsRole[selectedIndex]}
                              sx={{
                                '& .MuiListItemText-secondary': {
                                  color: 'black',
                                  fontWeight: '500',
                                },
                              }}
                            />
                            <ExpandMoreOutlinedIcon />
                          </ListItem>
                        </List>
                        <Menu
                          id="lock-menu"
                          anchorEl={anchorEl}
                          open={openMenu}
                          MenuListProps={{
                            'aria-labelledby': 'lock-button',
                            role: 'listbox',
                          }}
                          sx={{ color: 'black', fontWeight: 700 }}
                          onClose={handleMenuClose}
                        >
                          {optionsRole.map((option, index) => (
                            <MenuItem
                              key={option}
                              selected={index === selectedIndex}
                              disabled={
                                auth.role === Role.AGENCY
                                  ? index === optionsRole.indexOf(Role.AGENCY)
                                  : undefined
                              }
                              sx={{ alignItems: 'left', padding: '10px 38px' }}
                              onClick={(event) => handleMenuItemClick(event, index)}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Grid>
                      <Grid item xs={2} sx={{ marginTop: '16px' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ padding: '10px 18px' }}
                          type="submit"
                          disabled={!formik.isValid || !formik.dirty}
                        >
                          Share
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid>
                      <List>
                        {data?.map((member) => (
                          <ListItem
                            key={member.id}
                            alignItems="flex-start"
                            sx={{
                              padding: '0.5rem 0',
                              '& .MuiAvatar-colorDefault': {
                                height: '45px',
                                width: '45px',
                                marginRight: '1rem',
                              },
                            }}
                          >
                            <FallbackAvatars
                              key={member.id}
                              firstName={member.firstName}
                              lastName={member.lastName}
                            />
                            <div style={{ display: 'block' }}>
                              {member?.firstName} {member?.lastName}
                              <p style={{ color: 'grey', margin: '0' }}>{member?.email}</p>
                            </div>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </DialogContent>
                </Box>
              </Dialog>
            </Box>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  )
}
const ProjectPage = () => {
  const { id } = useParams()
  const [skipGetProjectById, setSkipGetProjectById] = useState<boolean>(false)
  const { data } = useGetProjectByIdQuery(String(id), { skip: skipGetProjectById })
  const projectStageResponse = useGetProjectStagesQuery(String(id), { skip: id === undefined })
  const [members, setMembers] = useState<IProjectMembers[]>()
  const [stages, setStages] = useState<TStage[] | null>(null)

  useEffect(() => {
    if (projectStageResponse.isSuccess) setStages(projectStageResponse.data)
  }, [projectStageResponse.data, projectStageResponse.isSuccess])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        height: '90vh',
        flexDirection: 'column',
      }}
    >
      {id && data && (
        <>
          <ProjectAppBar
            dataProject={data}
            setSkipGetProjectById={setSkipGetProjectById}
            members={members}
            setMemberData={setMembers}
          />
          {stages && <KanbanBoard projectStages={stages} members={members} />}

          {/* {auth.authorities?.includes(Privilege.DELETE_PROJECT) && <button>Delete project</button>} */}
        </>
      )}
    </Box>
  )
}

export default ProjectPage
