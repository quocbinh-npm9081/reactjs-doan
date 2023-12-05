import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'

import { formatDateTime } from '@/commons/helpers/utils'
import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { AuthState } from '@/types/auth/auth'
import { CommentsTaskResponse, TaskResponse } from '@/types/task/taskResponse'

import ShowReplyComment from './ShowReplyComment'
import TaskMarkdown from './TaskMarkdown'

interface TaskShowCommentProps {
  commentData: CommentsTaskResponse[]
  data: TaskResponse | undefined
  handleChangeComment: (data: string | undefined) => void
  handleClickSaveComment: () => void
  handleClickCancelComment: () => void
  handleClickSaveReplyComment: () => void
  handleClickCancelReplyComment: () => void
  handleReplyComment: (value: CommentsTaskResponse) => void
  handleEditComment: (value: CommentsTaskResponse) => void
  handleDeleteComment: (value: CommentsTaskResponse | undefined) => void
  refetch: () => void
  isShowMarkdownComment: boolean
  setIsShowMarkdownComment: (value: boolean) => void
  setIsShowMarkdownPostComment: (value: boolean) => void
  isShowMarkdownReplyComment: boolean
  setIsShowMarkdownReplyComment: (value: boolean) => void
  isShowMarkdownEditReplyComment: boolean
  setIsShowMarkdownEditReplyComment: (value: boolean) => void
  resultDeleteCommentSuccess: boolean
  resultDeleteCommentLoading: boolean
  auth: AuthState
  replyCommentData: CommentsTaskResponse[] | undefined
  isLoadingReplyComment: boolean
  isSuccessReplyComment: boolean
  refetchReplyComment: () => void
  isReplyCommentSelected: CommentsTaskResponse | undefined
  setIsReplyCommentSelected: (value: CommentsTaskResponse | undefined) => void
  setIdCommentSelected: (value: string) => void
  isCommentSelected: CommentsTaskResponse | undefined
  setIsCommentSelected: (value: CommentsTaskResponse | undefined) => void
  isLoadingPostComment: boolean
  isLoadingUpdateComment: boolean
}

export default function TaskShowComment({
  commentData,
  data,
  handleChangeComment,
  handleClickSaveComment,
  handleClickCancelComment,
  handleClickSaveReplyComment,
  handleClickCancelReplyComment,
  handleReplyComment,
  handleEditComment,
  handleDeleteComment,
  refetch,
  isShowMarkdownComment,
  setIsShowMarkdownComment,
  setIsShowMarkdownPostComment,
  isShowMarkdownReplyComment,
  setIsShowMarkdownReplyComment,
  isShowMarkdownEditReplyComment,
  setIsShowMarkdownEditReplyComment,
  resultDeleteCommentSuccess,
  resultDeleteCommentLoading,
  auth,
  replyCommentData,
  isLoadingReplyComment,
  refetchReplyComment,
  isReplyCommentSelected,
  setIsReplyCommentSelected,
  setIdCommentSelected,
  isCommentSelected,
  setIsCommentSelected,
  isLoadingPostComment,
  isLoadingUpdateComment,
}: TaskShowCommentProps) {
  const [isOpenDeleteCommentDialog, setIsOpenDeleteCommentDialog] = useState<boolean>(false)
  const [isShowReply, setIsShowReply] = useState<boolean>(false)

  const handleClickEdit = (comment: CommentsTaskResponse) => {
    setIsShowMarkdownComment(true)
    setIsShowMarkdownPostComment(false)
    setIsShowMarkdownReplyComment(false)
    setIsShowMarkdownEditReplyComment(false)
    handleEditComment(comment)
    setIsCommentSelected(comment)
  }

  const handleCancelDelete = () => {
    setIsOpenDeleteCommentDialog(false)
  }

  const handleClickReply = (comment: CommentsTaskResponse) => {
    setIsShowReply(true)
    setIsShowMarkdownEditReplyComment(false)
    handleReplyComment(comment)
    setIsReplyCommentSelected(comment)
    comment.id === isReplyCommentSelected?.id && setIsShowReply(!isShowReply)
  }

  useEffect(() => {
    if (resultDeleteCommentSuccess) {
      setIsOpenDeleteCommentDialog(false)
    }
  }, [resultDeleteCommentSuccess])

  const sortedComments = [...commentData].sort((a, b) => {
    const dateA = new Date(a.createdDate).valueOf()
    const dateB = new Date(b.createdDate).valueOf()

    return dateA - dateB
  })
  const sortedReplyComments =
    replyCommentData &&
    [...replyCommentData].sort((a, b) => {
      const dateA = new Date(a.createdDate).valueOf()
      const dateB = new Date(b.createdDate).valueOf()

      return dateA - dateB
    })

  return (
    <>
      {sortedComments.map((comment: CommentsTaskResponse) => (
        <Grid key={comment.id} container spacing={2} sx={{ marginTop: '0.3rem' }}>
          <Grid item xs={1}>
            {comment.user.firstName && comment.user.lastName && (
              <FallbackAvatars
                key={comment.id}
                firstName={comment.user.firstName}
                lastName={comment.user.lastName}
                border="none"
                tooltip={true}
              />
            )}
          </Grid>
          <Grid item xs={11}>
            {isCommentSelected?.id === comment.id && data && isShowMarkdownComment ? (
              <Box
                sx={{
                  '& .MuiBox-root': { marginTop: 0 },
                  '& .MuiDialogActions-root': { paddingBottom: 0 },
                }}
              >
                <TaskMarkdown
                  contentMarkdown={comment.content}
                  handleChange={handleChangeComment}
                  handleClickSave={handleClickSaveComment}
                  handleClickCancel={handleClickCancelComment}
                  data={data}
                  refetch={refetch}
                  isLoadingPostComment={isLoadingPostComment}
                  isLoadingUpdateComment={isLoadingUpdateComment}
                />
              </Box>
            ) : (
              <>
                <p style={{ margin: 0, marginBottom: '0.2rem', fontWeight: '600' }}>
                  {comment.user.firstName + ' ' + comment.user.lastName}
                  <span style={{ fontSize: '0.75rem', color: 'rgba(46, 46, 46, 0.85)' }}>
                    &emsp;
                    {formatDateTime(comment.createdDate)}
                    {comment.lastModifiedDate !== comment.createdDate ? ' (edited)' : ''}
                  </span>
                </p>
                <Box
                  role="presentation"
                  sx={{
                    width: '100%',
                    margin: '0',
                    padding: '0.8rem 0.5rem',
                    background: '#e5e5e5',
                    borderRadius: '5px',
                    fontSize: '0.9rem',
                    '& p': {
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    '& img': {
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover',
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(comment.content).replace(/\\/g, '').slice(1, -1),
                  }}
                ></Box>
                <Box
                  sx={{
                    marginTop: '0.2rem',
                    color: 'rgb(46 46 46 / 85%)',
                    fontSize: '0.9rem',
                    '& .css-5epw48-MuiCircularProgress-root': {
                      height: '1rem!important',
                      width: '1rem!important',
                      margin: '0 0.4rem',
                    },
                  }}
                >
                  <span
                    role="presentation"
                    className="text"
                    onClick={() => {
                      handleClickReply(comment)
                    }}
                    onKeyDown={() => {
                      handleClickReply(comment)
                    }}
                  >
                    {comment.countReply === 0
                      ? 'Reply'
                      : comment.countReply === 1
                      ? `${comment.countReply} reply`
                      : `${comment.countReply} replies`}
                  </span>
                  {isLoadingReplyComment && isReplyCommentSelected?.id === comment.id && (
                    <CircularProgress
                      sx={{ height: '15px!important', width: '15px!important', color: 'red' }}
                    />
                  )}
                  {auth.username === comment.user.email && (
                    <>
                      {'   '}&#8226;{'   '}
                      <span
                        role="presentation"
                        className="text"
                        onClick={() => handleClickEdit(comment)}
                        onKeyDown={() => handleEditComment}
                      >
                        Edit
                      </span>{' '}
                      &#8226;{' '}
                      <span
                        role="presentation"
                        className="text"
                        onClick={() => {
                          setIsOpenDeleteCommentDialog(true)
                          setIsCommentSelected(comment)
                        }}
                        onKeyDown={() => setIsCommentSelected}
                      >
                        Delete
                      </span>
                    </>
                  )}
                  {isReplyCommentSelected?.id === comment.id && isShowReply && replyCommentData && (
                    <>
                      {sortedReplyComments && (
                        <ShowReplyComment
                          commentData={sortedReplyComments}
                          data={data}
                          handleChangeComment={handleChangeComment}
                          handleClickSaveComment={handleClickSaveComment}
                          handleClickCancelComment={handleClickCancelComment}
                          handleEditComment={handleEditComment}
                          handleDeleteReplyComment={handleDeleteComment}
                          refetch={refetchReplyComment}
                          isShowMarkdownComment={isShowMarkdownComment}
                          setIsShowMarkdownPostComment={setIsShowMarkdownPostComment}
                          setIsShowMarkdownComment={setIsShowMarkdownComment}
                          setIsShowMarkdownReplyComment={setIsShowMarkdownReplyComment}
                          isShowMarkdownEditReplyComment={isShowMarkdownEditReplyComment}
                          setIsShowMarkdownEditReplyComment={setIsShowMarkdownEditReplyComment}
                          isOpenDeleteCommentDialog={isOpenDeleteCommentDialog}
                          setIsOpenDeleteCommentDialog={setIsOpenDeleteCommentDialog}
                          auth={auth}
                          setIsCommentSelected={setIsCommentSelected}
                        />
                      )}
                      <Grid container spacing={2} sx={{ marginTop: '0.2rem' }}>
                        <Grid item xs={1}>
                          {auth.firstName && auth.lastName && (
                            <FallbackAvatars
                              key={auth.username}
                              firstName={auth.firstName}
                              lastName={auth.lastName}
                              border="none"
                              tooltip={true}
                            />
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={11}
                          sx={{
                            '& .MuiBox-root': { marginTop: 0 },
                            '& .MuiDialogActions-root': { paddingBottom: 0 },
                          }}
                        >
                          {isShowMarkdownReplyComment && data ? (
                            <TaskMarkdown
                              handleChange={handleChangeComment}
                              handleClickSave={handleClickSaveReplyComment}
                              handleClickCancel={handleClickCancelReplyComment}
                              data={data}
                              refetch={refetch}
                              isLoadingPostComment={isLoadingPostComment}
                              isLoadingUpdateComment={isLoadingUpdateComment}
                            />
                          ) : (
                            <p
                              role="presentation"
                              style={{
                                width: '100%',
                                margin: '0',
                                padding: '0.5rem',
                                background: '#bababacf',
                                borderRadius: '5px',
                                fontSize: '0.9rem',
                              }}
                              onClick={() => {
                                setIsShowMarkdownReplyComment(true)
                                setIsShowMarkdownComment(false)
                                setIsShowMarkdownEditReplyComment(false)
                                setIdCommentSelected(comment.id)
                              }}
                              onKeyDown={() => setIsShowMarkdownReplyComment(true)}
                            >
                              Write a reply...
                            </p>
                          )}
                        </Grid>
                      </Grid>
                    </>
                  )}
                  <style>{`
                    .text{
                      text-decoration: underline;
                    }
                    .text:hover{
                        color: black;
                        cursor: pointer;
                    }`}</style>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      ))}
      <Dialog
        open={isOpenDeleteCommentDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={() => setIsOpenDeleteCommentDialog(false)}
      >
        <DialogTitle id="alert-dialog-title">Delete comment?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting a comment is forever. There is no undo.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 2rem', paddingBottom: '1.5rem' }}>
          <Button variant="outlined" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ background: '#a32626', '&:hover': { background: '#8b1919' } }}
            onClick={() => {
              handleDeleteComment(isCommentSelected)
            }}
          >
            {resultDeleteCommentLoading ? (
              <CircularProgress
                sx={{ height: '24px!important', width: '24px!important', color: 'red' }}
              />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
