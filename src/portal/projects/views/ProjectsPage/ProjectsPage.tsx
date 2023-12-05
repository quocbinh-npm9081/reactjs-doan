import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  useMediaQuery,
} from '@mui/material'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
// eslint-disable-next-line import/named
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import { ButtonContainer } from '@/portal/components/Buttons/ButtonContainer'
// eslint-disable-next-line import/namespace
import ActionCard from '@/portal/components/Cards/ActionCard'
import BasicCard from '@/portal/components/Cards/BasicCard'
import { CustomPaginationGrid } from '@/portal/components/CustomPaginationGrid/CustomPaginationGrid'
import FormProjectDialog, {
  TtextFields,
} from '@/portal/components/FormProjectDialog/FormProjectDialog'
import { PageLoader } from '@/routes/PageLoader/PageLoader'
import { useAuth } from '@/store/auth/useAuth'
import {
  useCreateProjectMutation,
  useGetMyProjectsQuery,
  useGetProjectsQuery,
} from '@/store/project/projectApi'
import { getProjects } from '@/store/project/projectSlice'
import { useGetProfilesFilter } from '@/store/project/useProject'
import { REGEX_CHECK_WHITESPACE } from '@/types/project/constants'
import { EStatusProject, TypeFormProject } from '@/types/project/projectEnum'
import { TGetProjectsRequest } from '@/types/project/projectRequest'
import { IMyProject } from '@/types/project/projectResponse'
import { Privilege, Role } from '@/types/user/userEnum'

interface IPropsProjectsPageForUser {
  projects: IMyProject[] | undefined
}

const ButtonDetail = ({ id }: { id: string }) => {
  const navigate = useNavigate()
  const openDetailUserPage = () => navigate(`/projects/${id}`)

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" color="primary" onClick={openDetailUserPage}>
        View
      </Button>
    </Stack>
  )
}
const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', minWidth: 200, sortingOrder: ['asc', 'desc'] },
  {
    field: 'description',
    headerName: 'Description',
    minWidth: 1090,
    sortingOrder: ['asc', 'desc'],
  },

  {
    field: 'action',
    headerName: '',
    minWidth: 196,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => <ButtonDetail id={String(params.id)} />,
  },
]

const ProjectPageAdmin = () => {
  const filterDefault = useGetProfilesFilter()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const matches = useMediaQuery('(min-width:600px)')

  const [filter, setFilter] = useState<TGetProjectsRequest>(filterDefault)
  const debouncedSearchKeyWord = useDebounce(filter.keyword, 300)

  const { data, isFetching, refetch } = useGetProjectsQuery({
    ...filter,
    keyword: debouncedSearchKeyWord,
  })
  const [paginationModel, setPaginationModel] = useState({
    page: filter.page,
    pageSize: filter.size,
  })
  const onHandleChange = (value: string | number, key: keyof TGetProjectsRequest) => {
    if (key === 'sort' && typeof value === 'string') {
      setFilter((prev) => {
        const existFullParams = prev?.sort.includes(String(value))
        if (existFullParams) {
          return {
            ...prev,
          }
        } else {
          const [newFieldName] = value.split(',')
          const sort = prev.sort.filter((field: string) => {
            const [fieldName] = field.split(',')
            return fieldName !== newFieldName
          })
          sort.push(value)
          return {
            ...prev,
            sort: sort,
          }
        }
      })
    } else {
      setFilter((prev: TGetProjectsRequest) => {
        return {
          ...prev,
          [key]: value,
        }
      })
    }
  }
  const onHandleReset = () => {
    setFilter({
      page: 0,
      size: 5,
      keyword: '',
      statuses: EStatusProject.ALL.toString(),
      sort: ['name,asc'],
    })
    setPaginationModel({
      page: 0,
      pageSize: 5,
    })
  }

  const handleChangePageToCreateUser = () => {
    navigate('/projects/create')
  }
  useEffect(() => {
    onHandleChange(paginationModel.page, 'page')
  }, [paginationModel.page])
  useEffect(() => {
    onHandleChange(paginationModel.pageSize, 'size')
  }, [paginationModel.pageSize])
  useEffect(() => {
    dispatch(getProjects({ filter: { ...filter, ...paginationModel } }))
    refetch()
  }, [paginationModel, filter, dispatch])

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0]
      let value = ''
      if (field === 'fullname') value = `firstName,${sort}`
      else value = `${field},${sort}`
      onHandleChange(value, 'sort')
    }
  }, [])

  return (
    <>
      <Box
        justifyContent="space-between"
        alignItems="center"
        display={matches ? 'flex' : 'inline-block'}
      >
        <Box
          display={matches ? 'flex' : 'inline-block'}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Box>
            <FormControl sx={{ m: 1, width: 120 }}>
              <InputLabel id="Status">Status</InputLabel>
              <Select
                key={filter.statuses}
                label="Status"
                id="Status"
                value={filter.statuses}
                defaultValue={filter.statuses}
                onChange={(event) => {
                  onHandleChange(event.target.value, 'statuses')
                }}
              >
                <MenuItem value={EStatusProject.ALL.toString()}>All</MenuItem>
                <MenuItem value={EStatusProject.CREATED.toString()}>Created</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* <Box>
              <TextFieldOutline
                value={String(filter.keyword)}
                label="Search"
                id="keyword"
                // onHandleChange={onHandleChange}
              />
            </Box> */}
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent={matches ? 'space-between' : 'flex-start'}
          mb={matches ? 0 : 1}
        >
          <Box m={1}>
            <ButtonContainer title="Reset" onClick={onHandleReset} />
          </Box>
          <Box m={1}>
            <ButtonContainer title="Create" onClick={handleChangePageToCreateUser} />
          </Box>
        </Box>
      </Box>
      <Box style={{ width: '100%', backgroundColor: 'white' }} mt={3}>
        <DataGrid
          pagination
          sx={{
            maxHeight: '50vh!important',
            '& .MuiDataGrid-overlayWrapper': {
              height: !isFetching && data?.content.length === 0 ? '80px!important' : '0px',
            },
            '& .MuiDataGrid-columnHeaders': {
              background:
                'linear-gradient(90deg, rgba(169,169,177,0.36458333333333337) 100%, rgba(212,220,222,0.4766281512605042) 100%)',
            },
            '& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus': {
              outline: 'none !important',
            },
            '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus': {
              outline: 'none !important',
            },
          }}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          loading={isFetching}
          rows={data?.content ? data?.content : []}
          columns={columns}
          rowCount={data?.totalElements ? data?.totalElements : 0}
          disableColumnMenu={true}
          slots={{
            pagination: CustomPaginationGrid,
          }}
          rowSelection={false}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={handleSortModelChange}
        />
      </Box>
    </>
  )
}

const ProjectsPageForUser = ({ projects }: IPropsProjectsPageForUser) => {
  const navigate = useNavigate()

  const openDetailUserPage = (id: string) => navigate(`/projects/${id}`)

  return (
    <>
      {projects?.map((project) => (
        <Box key={project.id} padding={2}>
          <BasicCard id={project.id} title={project.name} onClick={openDetailUserPage} />
        </Box>
      ))}
    </>
  )
}

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .strict(true)
    .matches(REGEX_CHECK_WHITESPACE, 'Not allowing whitespace more than two between words')
    .required('Name of the project is required'),
  description: yup.string().max(150, 'Description no more than 150 characters !'),
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

export default function ProjectsPage() {
  const auth = useAuth()
  const { data, isLoading } = useGetMyProjectsQuery()
  const [initialValues] = useState({
    name: '',
    description: '',
  })
  const [createProject, { isSuccess, error, isError }] = useCreateProjectMutation()
  const [openDialogCreateProject, setOpenDialogCreateProject] = useState<boolean>(false)
  const clickOpenDialog = () => setOpenDialogCreateProject(true)
  const submitCreateProject = (values: Record<string, string>) => {
    createProject({
      name: values.name,
      description: values.description ? values.description : undefined,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setOpenDialogCreateProject(false)
      toast.success('Create project succcessfully')
    }
  }, [isSuccess, isError])

  return (
    <>
      <FormProjectDialog
        textFields={textFieldsFormCreateProject}
        initialValues={initialValues}
        validationSchema={validationSchema}
        title={TypeFormProject.CREATE_NEW_PROJECT}
        isOpen={openDialogCreateProject}
        setIsOpen={setOpenDialogCreateProject}
        enableResetForm={true}
        error={error}
        isError={isError}
        onSubmit={submitCreateProject}
      />
      <h1 className="mb-4">Projects</h1>
      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {auth.role === Role.ADMINISTRATOR && <ProjectPageAdmin />}

          {auth.authorities?.includes(Privilege.VIEW_MY_PROJECT) && (
            <Box justifyContent="flex-start" alignItems="center">
              <Box sx={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                {auth.authorities?.includes(Privilege.CREATE_PROJECT) &&
                  auth.role !== Role.ADMINISTRATOR && (
                    <ActionCard
                      icon={<AddIcon fontSize="large" color="action" />}
                      onClick={clickOpenDialog}
                    />
                  )}
                <ProjectsPageForUser projects={data} />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  )
}
