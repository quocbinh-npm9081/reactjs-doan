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
  setIsOpen: (value: boolean) => void
  setDeactivate: (isDeactivate: boolean) => void
}
const AlertDeactivate = ({ isOpen, setIsOpen, setDeactivate }: IProps) => {
  const handleClose = () => {
    setIsOpen(false)
  }
  const handleDeActivate = async () => {
    setDeactivate(true)
    setIsOpen(false)
  }
  return (
    <div>
      <Dialog
        open={isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography fontSize={22}>Warning!</Typography>
        </DialogTitle>
        <DialogContent>Do you really want to deactivate this user?</DialogContent>
        <DialogActions sx={{ padding: '0.5rem 24px 24px 1.5rem' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" onClick={handleDeActivate}>
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AlertDeactivate
