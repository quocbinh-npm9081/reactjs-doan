import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, DialogActions } from '@mui/material'
import { useEffect } from 'react'

import { useUploadAttachmentsMutation } from '@/store/task/taskApi'
import { TaskResponse } from '@/types/task/taskResponse'

interface TaskDescriptionProps {
  taskDescription: string | undefined
  handleChange: (data: string) => void
  handleClickSave: () => void
  handleClickCancel: () => void
  data: TaskResponse
  refetch: () => void
}

export default function TaskDescription({
  taskDescription,
  handleChange,
  handleClickSave,
  handleClickCancel,
  data,
  refetch,
}: TaskDescriptionProps) {
  const [uploadAttachments, resultUpdateAttachments] = useUploadAttachmentsMutation()

  useEffect(() => {
    if (resultUpdateAttachments.isSuccess) {
      refetch()
    }
  }, [resultUpdateAttachments.isSuccess])

  function uploadImgAdapter(loader: { file: Promise<File> }) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const formData = new FormData()
          loader.file.then((file: File) => {
            formData.append('file', file)
            uploadAttachments({ id: data.id, formData: formData })
              .then((response) => {
                if ('data' in response) {
                  resolve({
                    default: `${import.meta.env.VITE_STORAGE_URL}/${data.projectId}/tasks/${
                      data.id
                    }/${response.data.name}`,
                  })
                } else {
                  console.error('Error in response:', response.error)
                }
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
      },
    }
  }

  function uploadImgPlugin(editor: {
    plugins: {
      get: (arg0: string) => {
        createUploadAdapter: (loader: { file: Promise<File> }) => { upload: () => Promise<unknown> }
      }
    }
  }) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: {
      file: Promise<File>
    }) => {
      return uploadImgAdapter(loader)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'inline-block',
        textAlign: 'left',
        marginTop: '1rem',
        '& .ck-dropdown__button': {
          display: 'none',
        },
        '& .ck-button_with-text': {
          display: 'inline-block',
        },
      }}
    >
      <CKEditor
        config={{
          extraPlugins: [uploadImgPlugin],
          link: {
            addTargetToExternalLinks: true,
          },
        }}
        editor={ClassicEditor}
        data={taskDescription}
        onChange={(event, editor) => {
          const data = editor.getData()
          handleChange(data)
        }}
      />
      <DialogActions sx={{ padding: '1rem 0' }}>
        <Button
          variant="outlined"
          sx={{
            padding: '4px',
            textTransform: 'initial',
            color: 'black',
            background: '#fff',
            border: '1px solid #e5e5e5',
            ':hover': {
              border: '1px solid #e5e5e5',
            },
          }}
          onClick={handleClickCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            padding: '4px',
            textTransform: 'initial',
          }}
          onClick={handleClickSave}
        >
          Save
        </Button>
      </DialogActions>
    </Box>
  )
}
