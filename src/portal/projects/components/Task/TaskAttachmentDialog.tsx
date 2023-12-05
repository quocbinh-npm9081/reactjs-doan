import { CloudUploadOutlined } from '@mui/icons-material'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
} from '@mui/material'
import { useEffect, useState } from 'react'

import { useUploadAttachmentsMutation } from '@/store/task/taskApi'
import { IDataResponse, IDataResponseError } from '@/types/BaseResponse'
import { MESSAGE_ATTACHMENT_IS_NOT_VALID, MESSAGE_FAILED_TO_FETCH } from '@/types/task/constants'
import { EmessageResponse } from '@/types/task/taskResponse'

interface TaskAttachmentDialogProps {
  isOpenTaskAttachmentDialog: boolean
  setIsOpenTaskAttachmentDialog: (value: boolean) => void
  taskId: string
  refetch: () => void
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export default function TaskAttachmentDialog({
  isOpenTaskAttachmentDialog,
  setIsOpenTaskAttachmentDialog,
  taskId,
  refetch,
}: TaskAttachmentDialogProps) {
  const [updateAttachments, resultUpdateAttachments] = useUploadAttachmentsMutation()
  const [file, setFile] = useState<File>()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0])
  }
  useEffect(() => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      updateAttachments({ id: taskId, formData: formData })
    }
  }, [file])

  useEffect(() => {
    if (resultUpdateAttachments.isSuccess) {
      setIsOpenTaskAttachmentDialog(false)
      refetch()
    }
  }, [resultUpdateAttachments.isSuccess])

  const errorResponse = { ...resultUpdateAttachments.error } as IDataResponse
  const errorCode = errorResponse?.data?.errorCode as EmessageResponse | null

  const tooLargeErrorResponse = { ...resultUpdateAttachments.error } as IDataResponseError
  const tooLargeError = tooLargeErrorResponse.error as EmessageResponse

  const customMessages: Record<EmessageResponse, string> = {
    [EmessageResponse.attachmentIsNotValid]: MESSAGE_ATTACHMENT_IS_NOT_VALID,
    [EmessageResponse.failedToFetch]: MESSAGE_FAILED_TO_FETCH,
  }
  const messageErr = errorCode
    ? customMessages[errorCode]
    : tooLargeError
    ? customMessages[tooLargeError]
    : ''

  return (
    <Dialog
      open={isOpenTaskAttachmentDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        height: '90%',
        width: '90%',
        textAlign: 'center',
        '& .MuiDialog-paper': {
          height: 'auto',
          width: '25%',
          paddingBottom: '1.5rem',
        },
      }}
      onClose={() => setIsOpenTaskAttachmentDialog(false)}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ padding: '1rem 2rem', textAlign: 'center', fontSize: '1.5rem' }}
      >
        Attach
      </DialogTitle>
      {resultUpdateAttachments.isError && (
        <Alert severity="error" className="m-0 mb-3 w-full">
          {messageErr}
        </Alert>
      )}
      <DialogContent sx={{ paddingTop: 0, paddingBottom: '0.7rem' }}>
        <p style={{ margin: '0' }}>Attach a file from your computer</p>
      </DialogContent>
      <DialogActions sx={{ width: '100%', justifyContent: 'center' }}>
        <Button component="label" variant="contained" startIcon={<CloudUploadOutlined />}>
          Choose a file
          <VisuallyHiddenInput
            type="file"
            accept=".jpg, .jpeg, .png, .pdf"
            onChange={handleFileChange}
          />
        </Button>
      </DialogActions>
    </Dialog>
  )
}
