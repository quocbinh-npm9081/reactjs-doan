import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

interface TaskChecklistDialogProps {
  isOpenTaskCheckListDialog: boolean
  setIsOpenTaskCheckListDialog: (value: boolean) => void
  setTitleCheckList: (value: string) => void
  handleAddChecklist: () => void
}

export default function TaskChecklistDialog({
  isOpenTaskCheckListDialog,
  setIsOpenTaskCheckListDialog,
  setTitleCheckList,
  handleAddChecklist,
}: TaskChecklistDialogProps) {
  const handleCancelChecklist = () => {
    setIsOpenTaskCheckListDialog(false)
  }

  return (
    <Dialog
      open={isOpenTaskCheckListDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        height: '110%',
        width: '150%',
        textAlign: 'center',
        '& .MuiDialog-paper': {
          height: 'auto',
          width: '16%',
          paddingBottom: '1.5rem',
        },
      }}
      onClose={() => setIsOpenTaskCheckListDialog(false)}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ padding: '1rem 2rem', paddingBottom: 0, textAlign: 'center', fontSize: '1.5rem' }}
      >
        Checklist
      </DialogTitle>
      <DialogContent sx={{ padding: '1rem', paddingTop: '1rem!important' }}>
        <TextField
          label="Title"
          id="outlined-size-small"
          size="small"
          variant="outlined"
          sx={{ width: '100%' }}
          onChange={(e) => setTitleCheckList(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ width: '100%', justifyContent: 'center' }}>
        <Button component="label" variant="outlined" onClick={handleCancelChecklist}>
          Cancel
        </Button>
        <Button component="label" variant="contained" onClick={handleAddChecklist}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
