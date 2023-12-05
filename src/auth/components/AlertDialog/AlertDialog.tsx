import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  isOpenDialog: boolean
  setopenDialog: (value: boolean) => void
  content: string
  title: string
  redirect: string | undefined
}

export default function AlertDialog({
  isOpenDialog,
  setopenDialog,
  content,
  title,
  redirect,
}: Props) {
  const navigate = useNavigate()
  const handleDisagree = () => {
    setopenDialog(false)
  }
  const handleAgree = () => {
    setopenDialog(false)
    if (redirect) navigate(redirect)
  }
  useEffect(() => {
    setopenDialog(isOpenDialog)
  }, [isOpenDialog, setopenDialog])

  return (
    <div>
      <Dialog
        open={isOpenDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => setopenDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>Cancel</Button>
          <Button onClick={handleAgree}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
