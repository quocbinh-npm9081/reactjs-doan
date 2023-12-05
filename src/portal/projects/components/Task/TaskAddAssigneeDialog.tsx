import { DoneOutlined } from '@mui/icons-material'
import { CircularProgress, Dialog, DialogTitle, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { useAuth } from '@/store/auth/useAuth'
import {
  useAssignCheckListItemMutation,
  useAssignTaskMutation,
  useUnAssignCheckListItemMutation,
  useUnassignTaskMutation,
} from '@/store/task/taskApi'
import { IProjectMembers } from '@/types/project/projectResponse'
import { CheckListItemTaskResponse, CheckListTaskResponse } from '@/types/task/taskResponse'

interface TaskAddAssigneeDialogProps {
  isOpenTaskAddAssigneeDialog: boolean
  setIsOpenTaskAddAssigneeDialog: (value: boolean) => void
  members: IProjectMembers[] | undefined
  taskId: string
  idAssignee: string
  setIdAssignee: (value: string) => void
  setFirstNameAssignee?: (value: string) => void
  setLastNameAssignee?: (value: string) => void
  checkList?: CheckListTaskResponse
  checkListItem?: CheckListItemTaskResponse
  refetchGetCheckList?: () => void
}

export default function TaskAddAssigneeDialog({
  isOpenTaskAddAssigneeDialog,
  setIsOpenTaskAddAssigneeDialog,
  members,
  taskId,
  idAssignee,
  setIdAssignee,
  setFirstNameAssignee,
  setLastNameAssignee,
  checkList,
  checkListItem,
  refetchGetCheckList,
}: TaskAddAssigneeDialogProps) {
  const auth = useAuth()
  const [assignTask, resultAssignTask] = useAssignTaskMutation()
  const [unassignTask, resultUnassignTask] = useUnassignTaskMutation()
  const [assignCheckListItem, resultAssignCheckListItem] = useAssignCheckListItemMutation()
  const [unAssignCheckListItem, resultUnAssignCheckListItem] = useUnAssignCheckListItemMutation()
  const [membersFilter, setMembersFilter] = useState<IProjectMembers[] | undefined>(members)

  const searchMember = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let filter = members
    if (e.target.value != '') {
      filter = members?.filter(
        (x) =>
          x.email.includes(e.target.value) ||
          x.lastName.includes(e.target.value) ||
          x.firstName.includes(e.target.value),
      )
    }
    setMembersFilter(filter)
  }

  const handleClickMember = (member: IProjectMembers) => {
    if (checkListItem && checkList) {
      if (idAssignee && idAssignee === member.id) {
        unAssignCheckListItem({
          id: checkList.taskId,
          checkListId: checkListItem.checkListId,
          checkListItemId: checkListItem.id,
        })
      } else {
        assignCheckListItem({
          id: checkList.taskId,
          checkListId: checkListItem.checkListId,
          checkListItemId: checkListItem.id,
          userId: member.id,
        })

        if (
          resultAssignCheckListItem.isSuccess &&
          member &&
          setFirstNameAssignee &&
          setLastNameAssignee
        ) {
          setIdAssignee(member.id)
          setFirstNameAssignee(member.firstName)
          setLastNameAssignee(member.lastName)
        }
      }
    } else {
      if (idAssignee && idAssignee === member.id) {
        unassignTask(taskId)

        if (resultUnassignTask.isSuccess && member && setFirstNameAssignee && setLastNameAssignee) {
          setIdAssignee('')
          setFirstNameAssignee(' ')
          setLastNameAssignee('')
        }
      } else {
        assignTask({
          id: taskId,
          userId: member.id,
        })

        if (resultAssignTask && member && setFirstNameAssignee && setLastNameAssignee) {
          setIdAssignee(member.id)
          setFirstNameAssignee(member.firstName)
          setLastNameAssignee(member.lastName)
        }
      }
    }
  }
  useEffect(() => {
    if (resultAssignTask.isSuccess) {
      setIsOpenTaskAddAssigneeDialog(false)
      toast.success('Assign successfully!')
    }
  }, [resultAssignTask.isSuccess])
  useEffect(() => {
    if (resultUnassignTask.isSuccess) {
      setIsOpenTaskAddAssigneeDialog(false)
      toast.success('Unassign successfully!')
    }
  }, [resultUnassignTask.isSuccess])
  useEffect(() => {
    if (resultAssignCheckListItem.isSuccess && refetchGetCheckList) {
      refetchGetCheckList()
      setIsOpenTaskAddAssigneeDialog(false)
      toast.success('Assign successfully!')
    }
  }, [resultAssignCheckListItem.isSuccess])
  useEffect(() => {
    if (resultUnAssignCheckListItem.isSuccess && refetchGetCheckList) {
      refetchGetCheckList()
      setIsOpenTaskAddAssigneeDialog(false)
      setIdAssignee('')
      toast.success('Unassign successfully!')
    }
  }, [resultUnAssignCheckListItem.isSuccess])

  return (
    <Dialog
      open={isOpenTaskAddAssigneeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        height: '100%',
        width: '80%',
        textAlign: 'center',
        '& .MuiDialog-paper': {
          height: '380px',
          width: '30%',
          paddingBottom: '1.5rem',
        },
      }}
      onClose={() => setIsOpenTaskAddAssigneeDialog(false)}
    >
      <DialogTitle id="alert-dialog-title" sx={{ padding: '1rem 2rem' }}>
        Assignee
        {resultAssignTask.isLoading ||
        resultUnassignTask.isLoading ||
        resultAssignCheckListItem.isLoading ||
        resultUnAssignCheckListItem.isLoading ? (
          <CircularProgress
            sx={{
              height: '15px!important',
              width: '15px!important',
              marginLeft: '0.5rem',
              color: 'red',
            }}
          />
        ) : (
          ''
        )}
      </DialogTitle>
      <TextField
        id="outlined-basic"
        label="Search by email"
        variant="outlined"
        size="small"
        sx={{ width: '90%', margin: '0 auto' }}
        onChange={(e) => {
          searchMember(e)
        }}
      />
      {membersFilter && membersFilter.length > 0
        ? membersFilter.map((member) => {
            return (
              <li
                key={member?.id}
                role="menuitem"
                style={{
                  display: 'flex',
                  textAlign: 'left',
                  margin: '0 1rem',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#bababacf'
                  e.currentTarget.style.cursor = 'pointer'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.cursor = 'default'
                }}
                onClick={() => handleClickMember(member)}
                onKeyDown={() => handleClickMember(member)}
              >
                <FallbackAvatars
                  key={member.id}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  height="40px"
                  width="40px"
                  border="none"
                />
                <div style={{ margin: '0 0.8rem' }}>
                  {member?.firstName} {member?.lastName}{' '}
                  <span style={{ color: 'black', margin: '5px 0', display: 'block' }}>
                    {member?.email}{' '}
                    {auth.username === member.email ? (
                      <p style={{ color: 'grey', margin: 0 }}> (Assign to me) </p>
                    ) : (
                      ''
                    )}
                  </span>
                </div>
                {idAssignee === member.id && <DoneOutlined />}
              </li>
            )
          })
        : 'No option.'}
    </Dialog>
  )
}
