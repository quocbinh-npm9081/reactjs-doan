import { AttachmentOutlined } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import pdf from '@/assets/pdf.png'
import { formatDateTime } from '@/commons/helpers/utils'
import { TAttachment } from '@/types/project/projectResponse'
import { AttachmentsTaskResponse, TaskResponse } from '@/types/task/taskResponse'

interface TaskAttachmentProps {
  setIsOpenTaskAttachmentDialog: (value: boolean) => void
  isOpenDeleteAttachmentDialog: boolean
  setIsOpenDeleteAttachmentDialog: (value: boolean) => void
  isOpenUpdateAttachmentDialog: boolean
  setIsOpenUpdateAttachmentDialog: (value: boolean) => void
  setIsNameAttachmentUpadte: (value: string) => void
  data: TaskResponse | undefined
  handleDeleteAttachment: (value: TAttachment) => void
  handleUpdateAttachment: (value: TAttachment) => void
  handleAgreeDelete: () => void
  handleUpdate: () => void
  resultUpdateAttachmentLoading: boolean
}

export default function TaskAttachment({
  setIsOpenTaskAttachmentDialog,
  isOpenDeleteAttachmentDialog,
  setIsOpenDeleteAttachmentDialog,
  isOpenUpdateAttachmentDialog,
  setIsOpenUpdateAttachmentDialog,
  setIsNameAttachmentUpadte,
  data,
  handleDeleteAttachment,
  handleUpdateAttachment,
  handleAgreeDelete,
  handleUpdate,
  resultUpdateAttachmentLoading,
}: TaskAttachmentProps) {
  const [itemSelected, setItemSelected] = useState<AttachmentsTaskResponse>()

  const handleCancelDelete = () => {
    setIsOpenDeleteAttachmentDialog(false)
  }
  const handleCancelUpdate = () => {
    setIsOpenUpdateAttachmentDialog(false)
  }
  const handleUpdateKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleUpdate()
    }
  }
  const sortedAttachments =
    data &&
    [...data.attachments].sort((a, b) => {
      const dateA = new Date(a.createdDate).valueOf()
      const dateB = new Date(b.createdDate).valueOf()

      return dateA - dateB
    })

  return (
    <Grid container spacing={2} sx={{ paddingTop: '2rem' }}>
      <Grid item xs={1}>
        <AttachmentOutlined sx={{ marginRight: '1rem' }} />
      </Grid>
      <Grid item xs={11} sx={{ paddingLeft: '10px!important' }}>
        <strong>Attachment</strong>
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
          onClick={() => setIsOpenTaskAttachmentDialog(true)}
        >
          Add
        </Button>
        {data &&
          sortedAttachments?.map((item) => (
            <ListItem key={item.id} sx={{ display: 'flex', padding: '0', margin: '0.8rem 0' }}>
              {item.name.includes('.pdf') ? (
                <img
                  src={pdf}
                  alt={item.originalName}
                  style={{
                    height: '80px',
                    width: '112px',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_STORAGE_URL}/${data.projectId}/tasks/${data.id}/${
                    item.name
                  }`}
                  alt={item.originalName}
                  style={{
                    height: '80px',
                    width: '112px',
                    marginRight: '0.5rem',
                    borderRadius: '5px',
                    objectFit: 'cover',
                  }}
                />
              )}

              <ListItemText
                sx={{
                  display: 'block',
                  margin: 'auto 0',
                }}
              >
                <Typography sx={{ margin: '0', fontSize: '0.9rem', fontWeight: '500' }}>
                  {item.originalName}
                </Typography>

                <div
                  style={{
                    color: 'rgb(46 46 46 / 85%)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Added {formatDateTime(item.createdDate)}</span> &#8226;{' '}
                  <span
                    role="presentation"
                    className="text"
                    onClick={() => handleDeleteAttachment(item)}
                    onKeyDown={() => handleDeleteAttachment}
                  >
                    Delete
                  </span>{' '}
                  &#8226;{' '}
                  <span
                    role="presentation"
                    className="text"
                    onClick={() => {
                      handleUpdateAttachment(item)
                      setItemSelected(item)
                    }}
                    onKeyDown={() => handleUpdateAttachment}
                  >
                    Edit
                  </span>
                  <style>{`
                  .text{
                    text-decoration: underline;
                  }
                  .text:hover{
                      color: black;
                      cursor: pointer;
                  }`}</style>
                </div>
              </ListItemText>
            </ListItem>
          ))}
        <Dialog
          open={isOpenDeleteAttachmentDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onClose={() => setIsOpenDeleteAttachmentDialog(false)}
        >
          <DialogTitle id="alert-dialog-title">Delete attachment?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting an attachment is permanent. There is no undo.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: '0 2rem', paddingBottom: '1.5rem' }}>
            <Button variant="outlined" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ background: '#a32626', '&:hover': { background: '#8b1919' } }}
              onClick={handleAgreeDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isOpenUpdateAttachmentDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            height: '100%',
            width: '100%',
            '& .MuiDialog-paper': {
              width: '30%',
            },
          }}
          onClose={() => setIsOpenUpdateAttachmentDialog(false)}
          onKeyDown={handleUpdateKeyDown}
        >
          <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
            Edit attachment
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Link name</DialogContentText>
            <TextField
              hiddenLabel
              variant="standard"
              sx={{
                '& .MuiInputBase-input ': {},
              }}
              className=" focus:border-rose-500 border rounded outline-none p-0 w-full"
              defaultValue={itemSelected?.originalName}
              inputProps={{ 'aria-label': 'title of task' }}
              onChange={(e) => setIsNameAttachmentUpadte(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ padding: '0 2rem', paddingBottom: '1.5rem' }}>
            <Button variant="outlined" onClick={handleCancelUpdate}>
              Cancel
            </Button>
            <Button autoFocus type="submit" variant="contained" onClick={handleUpdate}>
              {resultUpdateAttachmentLoading ? (
                <CircularProgress
                  sx={{ height: '24px!important', width: '24px!important', color: 'white' }}
                />
              ) : (
                'Update'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}
