import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import useMediaQuery from '@mui/material/useMediaQuery'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'
// eslint-disable-next-line import/named
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { ButtonContainer } from '@/portal/components/Buttons/ButtonContainer'
import { CustomPaginationGrid } from '@/portal/components/CustomPaginationGrid/CustomPaginationGrid'
import SwitchButtonStatus from '@/portal/components/SwitchButtons/SwitchButtonStatus'
import { TextFieldOutline } from '@/portal/components/TextFields/TextFieldOutline'
import { useAuth } from '@/store/auth/useAuth'
import { useGetUsersQuery, useUpdateStatusUserMutation } from '@/store/user/userApi'
import { getUsers } from '@/store/user/userSlice'
import { useGetUsersFilter } from '@/store/user/useUser'
import { Role, Status } from '@/types/user/userEnum'
import { GetUsersRequest } from '@/types/user/userRequest'

const tranformCapitalizeFirstLetter = (text: string) => {
  const wordArr = text.split('_')
  const textLowerCase = wordArr.join(' ').toLowerCase()
  const capitalizeFirstLetter = textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1)
  return capitalizeFirstLetter
}

const ButtonDetail = ({ id }: { id: string }) => {
  const navigate = useNavigate()
  const openDetailUserPage = () => navigate(`/users/${id}`)

  return (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" color="primary" onClick={openDetailUserPage}>
        View
      </Button>
    </Stack>
  )
}
const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', minWidth: 170, sortingOrder: ['asc', 'desc'] },
  { field: 'lastName', headerName: 'Last Name', minWidth: 170, sortingOrder: ['asc', 'desc'] },
  { field: 'username', headerName: 'Username', minWidth: 320, sortingOrder: ['asc', 'desc'] },
  {
    field: 'gender',
    headerName: 'Gender',
    minWidth: 130,
    sortingOrder: ['asc', 'desc'],
    valueGetter: (params) => {
      if (params.value) return tranformCapitalizeFirstLetter(params.value)
    },
  },
  {
    field: 'phoneNumber',
    headerName: 'Phone Number',
    minWidth: 170,
    sortingOrder: ['asc', 'desc'],
  },
  {
    field: 'role',
    headerName: 'Role',
    minWidth: 180,
    sortingOrder: ['asc', 'desc'],
    valueGetter: (params) => {
      if (params.value) return tranformCapitalizeFirstLetter(params.value)
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 200,
    sortable: false,
    align: 'left',
    headerAlign: 'center',
    renderCell: (params) => {
      const currentStatus = params.row.status
      const [status, setStatus] = useState<Status>(currentStatus)
      const [updateStatusUser, { isSuccess, data }] = useUpdateStatusUserMutation()
      const handleChangeStatus = ({ userId, newStatus }: { userId: string; newStatus: Status }) => {
        updateStatusUser({
          userId: userId,
          newStatus: newStatus,
        })
      }
      useEffect(() => {
        if (data && data?.status) setStatus(data?.status)
      }, [data?.status])

      return (
        <SwitchButtonStatus
          id={String(params.id)}
          status={status}
          isSuccess={isSuccess}
          onClick={handleChangeStatus}
        />
      )
    },
  },
  {
    field: 'action',
    headerName: '',
    minWidth: 90,
    headerAlign: 'center',
    sortable: false,
    renderCell: (params) => <ButtonDetail id={String(params.id)} />,
  },
]
export default function UsersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useAuth()
  const filterDefault = useGetUsersFilter()
  const matches = useMediaQuery('(min-width:600px)')
  const [filter, setFilter] = useState<GetUsersRequest>(filterDefault)
  const debouncedSearchKeyWord = useDebounce(filter.keyword, 300)
  const { data, isFetching, refetch } = useGetUsersQuery({
    ...filter,
    keyword: debouncedSearchKeyWord,
  })

  const [paginationModel, setPaginationModel] = useState({
    page: filter.page,
    pageSize: filter.size,
  })

  const onHandleChange = (value: string | number, key: keyof GetUsersRequest) => {
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
      setFilter((prev: GetUsersRequest) => {
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
      statuses: Status.ALL.toString(),
      roles: Role.ALL.toString(),
      sort: ['firstName,asc'],
    })
    setPaginationModel({
      page: 0,
      pageSize: 5,
    })
  }

  const handleChangePageToCreateUser = () => {
    navigate('/users/create')
  }

  useEffect(() => {
    onHandleChange(paginationModel.page, 'page')
  }, [paginationModel.page])

  useEffect(() => {
    onHandleChange(paginationModel.pageSize, 'size')
  }, [paginationModel.pageSize])

  useEffect(() => {
    dispatch(getUsers({ filter: { ...filter, ...paginationModel } }))
    refetch()
  }, [paginationModel, filter, dispatch])

  useLayoutEffect(() => {
    if (auth.role !== Role.ADMINISTRATOR) navigate('/dashboard')
  }, [auth.role])

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
      <h1 className="mb-4">Users</h1>
      <>
        {' '}
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
                  <MenuItem value={Status.ALL.toString()}>All</MenuItem>
                  <MenuItem value={Status.ACTIVE.toString()}>Active</MenuItem>
                  <MenuItem value={Status.INACTIVE.toString()}>In active</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl sx={{ m: 1, width: 180 }}>
                <InputLabel id="Roles">Roles</InputLabel>
                <Select
                  key={filter.roles}
                  label="Roles"
                  id="Roles"
                  value={filter.roles}
                  defaultValue={filter.roles}
                  onChange={(event) => {
                    onHandleChange(event.target.value, 'roles')
                  }}
                >
                  <MenuItem value={Role.ALL.toString()}>All</MenuItem>
                  <MenuItem value={Role.AGENCY.toString()}>Agency</MenuItem>
                  <MenuItem value={Role.PROJECT_MANAGER.toString()}>Project manager</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextFieldOutline
                value={String(filter.keyword)}
                label="Search"
                id="keyword"
                onHandleChange={onHandleChange}
              />
            </Box>
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
    </>
  )
}
