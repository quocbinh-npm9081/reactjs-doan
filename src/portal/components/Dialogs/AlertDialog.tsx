import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

interface IProps {
  isOpen: boolean
  onAfterCloseDialog: () => void
  onAfterConfirm: () => void
  title: string
  dialogContent: string
}
const AlertDialog = ({
  title,
  dialogContent,
  isOpen,
  onAfterCloseDialog,
  onAfterConfirm,
}: IProps) => {
  const onConfirm = async () => {
    onAfterCloseDialog()
    onAfterConfirm()
  }
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => onAfterCloseDialog()}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography fontSize={22}>{title}</Typography>
        </DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions sx={{ padding: '0 2rem', paddingBottom: '1.5rem' }}>
          <Button color="inherit" variant="text" onClick={() => onAfterCloseDialog()}>
            No
          </Button>
          <Button color="warning" variant="contained" onClick={onConfirm}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlertDialog
