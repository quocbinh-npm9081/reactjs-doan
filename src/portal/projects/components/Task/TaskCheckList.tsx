import {
  AccessTimeOutlined,
  DeleteOutline,
  PersonAddAltOutlined,
  TaskAltOutlined,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { useGetProjectMemberQuery } from '@/store/project/projectApi'
import { CheckListItemTaskResponse, CheckListTaskResponse } from '@/types/task/taskResponse'

import TaskAddAssigneeDialog from './TaskAddAssigneeDialog'

interface TaskCheckListProps {
  dataGetCheckList: CheckListTaskResponse[] | undefined
  checklistSelect: CheckListTaskResponse | undefined
  setChecklistSelect: (value: CheckListTaskResponse | undefined) => void
  checklistItemSelect: CheckListItemTaskResponse | undefined
  setChecklistItemSelect: (value: CheckListItemTaskResponse | undefined) => void
  handleAddItem: (value: CheckListTaskResponse) => void
  setTextCheckListItem: (value: string) => void
  isAddNewItem: boolean
  setIsAddNewItem: (value: boolean) => void
  handleChangeCheckbox: (
    checklistItem: CheckListItemTaskResponse,
    checklist: CheckListTaskResponse,
  ) => void
  countIsDone: (checklistItems: CheckListItemTaskResponse[]) => number
  setTextTitleCheckList: (value: string) => void
  handleEditTitleChecklist: (checklist: CheckListTaskResponse) => void
  handleDeleteCheckList: (checklist: CheckListTaskResponse | undefined) => void
  handleEditItemChecklist: (
    checklist: CheckListTaskResponse,
    checklistItems: CheckListItemTaskResponse,
  ) => void
  handleClickDeleteCheckListItem: (
    checklist: CheckListTaskResponse,
    checklistItems: CheckListItemTaskResponse,
  ) => void
  refetchGetCheckList: () => void
}

export default function TaskCheckList({
  dataGetCheckList,
  checklistSelect,
  setChecklistSelect,
  checklistItemSelect,
  setChecklistItemSelect,
  handleAddItem,
  setTextCheckListItem,
  isAddNewItem,
  setIsAddNewItem,
  handleChangeCheckbox,
  countIsDone,
  setTextTitleCheckList,
  handleEditTitleChecklist,
  handleDeleteCheckList,
  handleEditItemChecklist,
  handleClickDeleteCheckListItem,
  refetchGetCheckList,
}: TaskCheckListProps) {
  const { id } = useParams()
  const { data } = useGetProjectMemberQuery(String(id), { skip: id === undefined })

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }))

  const [isEditTitleCheckList, setIsEditTitleCheckList] = useState<boolean>(false)
  const [isEditItemCheckList, setIsEditItemCheckList] = useState<boolean>(false)
  const [isShowDeleteCheckList, setIsShowDeleteCheckList] = useState<boolean>(false)
  const [isChecklistSelect, setIsChecklistSelect] = useState<CheckListTaskResponse>()
  const [isChecklistItemHover, setIsChecklistItemHover] = useState<CheckListItemTaskResponse>()
  const [isShowOption, setIsShowOption] = useState<boolean>(false)
  const [isShowAssignCheckListItem, setIsShowAssignCheckListItem] = useState<boolean>(false)
  const [idAssignee, setIdAssignee] = useState<string>('')

  return (
    <>
      {dataGetCheckList?.map((checklist) => (
        <Box key={checklist.id} sx={{ paddingTop: '2rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={1}>
              <TaskAltOutlined sx={{ marginRight: '1rem' }} />
            </Grid>
            <Grid item xs={11} sx={{ paddingLeft: '10px!important' }}>
              {isEditTitleCheckList && checklistSelect?.id === checklist.id ? (
                <>
                  <TextField
                    id="outlined-basic"
                    placeholder="Add an item"
                    variant="outlined"
                    sx={{ width: '100%' }}
                    defaultValue={checklist.name}
                    onChange={(e) => setTextTitleCheckList(e.target.value)}
                  />
                  <Box sx={{ margin: '0.5rem 0 1rem 0' }}>
                    <Button
                      variant="contained"
                      sx={{
                        padding: '4px',
                        textTransform: 'initial',
                      }}
                      onClick={() => {
                        handleEditTitleChecklist(checklist)
                        setIsEditTitleCheckList(false)
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        marginLeft: '0.5rem',
                        padding: '4px',
                        textTransform: 'initial',
                      }}
                      onClick={() => setIsEditTitleCheckList(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Box
                    sx={{ width: '90%', '& strong': { ':hover': { cursor: 'pointer' } } }}
                    onClick={() => {
                      setIsEditTitleCheckList(true)
                      setChecklistSelect(checklist)
                      setTextTitleCheckList(checklist.name)
                    }}
                    onKeyDown={() => setIsEditTitleCheckList(true)}
                  >
                    <strong>{checklist.name}</strong>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      float: 'right',
                      padding: '4px',
                      textTransform: 'initial',
                      color: '#000',
                      background: '#d5d5d59c',
                      ':hover': { background: '#bababacf' },
                    }}
                    onClick={() => {
                      setIsShowDeleteCheckList(true)
                      setIsChecklistSelect(checklist)
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ alignItems: 'center', marginBottom: '1rem' }}>
            <Grid item xs={1} sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
              {Math.round(
                (countIsDone(checklist.checkListItems) / checklist.checkListItems.length) * 100,
              ) | 0}
              %
            </Grid>
            <Grid item xs={11} sx={{ paddingLeft: '10px!important', margin: '0.5rem 0' }}>
              <BorderLinearProgress
                variant="determinate"
                value={
                  Math.round(
                    (countIsDone(checklist.checkListItems) / checklist.checkListItems.length) * 100,
                  ) | 0
                }
              />
            </Grid>
          </Grid>
          {checklist.checkListItems.map((checklistItem) => (
            <Grid
              key={checklistItem.id}
              container
              spacing={2}
              sx={{
                alignItems: 'center',
                margin: '0.2rem 0',
                '& .MuiGrid-grid-xs-11': { padding: '0!important' },
                '& .MuiGrid-grid-xs-11:hover': {
                  cursor: 'pointer',
                  background: '#eeeeee',
                  borderRadius: '0.5rem',
                },
              }}
            >
              <Grid item xs={0.8} sx={{ padding: '0!important', alignItems: 'flex-start' }}>
                <Checkbox
                  checked={checklistItem.isDone}
                  onChange={() => handleChangeCheckbox(checklistItem, checklist)}
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  paddingLeft: '10px!important',
                }}
              >
                {isEditItemCheckList && checklistItemSelect?.id === checklistItem.id ? (
                  <Box sx={{ padding: '0.5rem', background: '#eeeeee', borderRadius: '0.5rem' }}>
                    <TextField
                      id="outlined-basic"
                      placeholder="Add an item"
                      variant="outlined"
                      sx={{ width: '100%' }}
                      defaultValue={checklistItem.content}
                      onChange={(e) => setTextCheckListItem(e.target.value)}
                    />
                    <Box sx={{ padding: '0.5rem 0' }}>
                      <Button
                        variant="contained"
                        sx={{
                          padding: '4px',
                          textTransform: 'initial',
                        }}
                        onClick={() => {
                          handleEditItemChecklist(checklist, checklistItem)
                          setIsEditItemCheckList(false)
                          setIsShowOption(false)
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          marginLeft: '0.5rem',
                          padding: '4px',
                          textTransform: 'initial',
                        }}
                        onClick={() => {
                          setIsEditItemCheckList(false)
                          setIsShowOption(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      padding: '0 0.5rem',
                      alignItems: 'center',
                    }}
                    onMouseEnter={() => {
                      setIsShowOption(true)
                      setIsChecklistItemHover(checklistItem)
                    }}
                    onMouseLeave={() => {
                      setIsShowOption(false)
                      setIsChecklistItemHover(undefined)
                    }}
                  >
                    <p
                      role="presentation"
                      style={
                        checklistItem.isDone
                          ? { margin: 0, textDecoration: 'line-through', width: '75%' }
                          : { margin: 0, width: '75%' }
                      }
                      onClick={() => {
                        setIsEditItemCheckList(true)
                        setChecklistItemSelect(checklistItem)
                        setTextCheckListItem(checklistItem.content)
                      }}
                      onKeyDown={() => setIsEditItemCheckList(true)}
                    >
                      {checklistItem.content}
                    </p>
                    {isShowOption && isChecklistItemHover?.id === checklistItem.id && (
                      <Box sx={{ marginLeft: 'auto' }}>
                        <IconButton sx={{ '& .MuiIconButton-root': { padding: '0.2rem' } }}>
                          <AccessTimeOutlined
                            sx={{
                              height: '1.2rem',
                              width: '1.2rem',
                            }}
                          />
                        </IconButton>
                        {isShowAssignCheckListItem && data && (
                          <TaskAddAssigneeDialog
                            isOpenTaskAddAssigneeDialog={isShowAssignCheckListItem}
                            setIsOpenTaskAddAssigneeDialog={setIsShowAssignCheckListItem}
                            members={data}
                            taskId={checklist.taskId}
                            idAssignee={idAssignee}
                            setIdAssignee={setIdAssignee}
                            checkList={checklist}
                            checkListItem={checklistItem}
                            refetchGetCheckList={() => refetchGetCheckList()}
                          />
                        )}

                        {checklistItem.assignee &&
                        checklistItem.assignee.lastName &&
                        checklistItem.assignee.firstName ? (
                          <IconButton
                            onClick={() => {
                              setIsShowAssignCheckListItem(true)
                              setIsShowOption(false)
                              checklistItem.assignee.id && setIdAssignee(checklistItem.assignee.id)
                            }}
                          >
                            <FallbackAvatars
                              key={checklistItem.assignee.id}
                              firstName={checklistItem.assignee.firstName}
                              lastName={checklistItem.assignee.lastName}
                              width="1.2rem"
                              height="1.2rem"
                              fontSize="0.5rem"
                              border="none"
                              tooltip={true}
                            />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => {
                              setIsShowAssignCheckListItem(true)
                              setIsShowOption(false)
                              setIdAssignee('')
                            }}
                          >
                            <PersonAddAltOutlined sx={{ height: '1.2rem', width: '1.2rem' }} />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => handleClickDeleteCheckListItem(checklist, checklistItem)}
                        >
                          <DeleteOutline sx={{ height: '1.2rem', width: '1.2rem' }} />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          ))}
          <Box sx={{ marginLeft: '2.5rem' }}>
            {isAddNewItem && checklistSelect?.id === checklist.id ? (
              <>
                <TextField
                  id="outlined-basic"
                  placeholder="Add an item"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  onChange={(e) => setTextCheckListItem(e.target.value)}
                />
                <Box sx={{ marginTop: '0.5rem' }}>
                  <Button
                    variant="contained"
                    sx={{
                      padding: '4px',
                      textTransform: 'initial',
                    }}
                    onClick={() => handleAddItem(checklist)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      marginLeft: '0.5rem',
                      padding: '4px',
                      textTransform: 'initial',
                    }}
                    onClick={() => setIsAddNewItem(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    padding: '4px 8px',
                    textTransform: 'initial',
                    color: '#000',
                    background: '#d5d5d59c',
                    ':hover': { background: '#bababacf' },
                  }}
                  onClick={() => {
                    setIsAddNewItem(true)
                    setChecklistSelect(checklist)
                  }}
                >
                  Add an item
                </Button>
              </>
            )}
          </Box>
        </Box>
      ))}
      <Dialog
        open={isShowDeleteCheckList}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => setIsShowDeleteCheckList(false)}
      >
        <DialogTitle id="alert-dialog-title">Delete checklist?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting a checklist is permanent and there is no way to get it back.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 2rem', paddingBottom: '1.5rem' }}>
          <Button variant="outlined" onClick={() => setIsShowDeleteCheckList(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: '#a32626', '&:hover': { background: '#8b1919' } }}
            onClick={() => {
              setIsShowDeleteCheckList(false)
              handleDeleteCheckList(isChecklistSelect)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
