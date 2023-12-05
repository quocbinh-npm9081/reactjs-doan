import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect } from 'react'

interface Props {
  isOpenDialog: boolean
  setIsOpenDialog: (value: boolean) => void
  title: string
  content: string
  id: string
  handleReject: (id: string) => void
  setOptionButton: (value: boolean) => void
  setTextButton: (value: string) => void
}

export default function InvitationDialog({
  isOpenDialog,
  setIsOpenDialog,
  title,
  content,
  id,
  handleReject,
  setOptionButton,
  setTextButton,
}: Props) {
  const handleDisagree = () => {
    setIsOpenDialog(false)
  }
  const handleAgree = () => {
    setIsOpenDialog(false)
    handleReject(id)
    setOptionButton(false)
    setTextButton('Rejected')
  }
  useEffect(() => {
    setIsOpenDialog(isOpenDialog)
  }, [isOpenDialog, setIsOpenDialog])

  return (
    <div>
      <Dialog
        open={isOpenDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => setIsOpenDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px', paddingBottom: '1.5rem' }}>
          <Button variant="outlined" color="inherit" onClick={handleDisagree}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleAgree}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
