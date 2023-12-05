import { Box, Grid } from '@mui/material'
import { useState } from 'react'

import { formatDateTime } from '@/commons/helpers/utils'
import FallbackAvatars from '@/portal/components/Avata/FallbackAvatars'
import { AuthState } from '@/types/auth/auth'
import { CommentsTaskResponse, TaskResponse } from '@/types/task/taskResponse'

import TaskMarkdown from './TaskMarkdown'

interface ShowReplyCommentProps {
  commentData: CommentsTaskResponse[]
  data: TaskResponse | undefined
  handleChangeComment: (data: string | undefined) => void
  handleClickSaveComment: () => void
  handleClickCancelComment: () => void
  handleEditComment: (value: CommentsTaskResponse) => void
  handleDeleteReplyComment: (value: CommentsTaskResponse | undefined) => void
  refetch: () => void
  isShowMarkdownComment: boolean
  setIsShowMarkdownPostComment: (value: boolean) => void
  setIsShowMarkdownComment: (value: boolean) => void
  setIsShowMarkdownReplyComment: (value: boolean) => void
  isShowMarkdownEditReplyComment: boolean
  setIsShowMarkdownEditReplyComment: (value: boolean) => void
  isOpenDeleteCommentDialog: boolean
  setIsOpenDeleteCommentDialog: (value: boolean) => void
  auth: AuthState
  setIsCommentSelected: (value: CommentsTaskResponse | undefined) => void
}

export default function ShowReplyComment({
  commentData,
  data,
  handleChangeComment,
  handleClickSaveComment,
  handleEditComment,
  refetch,
  setIsShowMarkdownPostComment,
  setIsShowMarkdownComment,
  setIsShowMarkdownReplyComment,
  isShowMarkdownEditReplyComment,
  setIsShowMarkdownEditReplyComment,
  setIsOpenDeleteCommentDialog,
  auth,
  setIsCommentSelected,
}: ShowReplyCommentProps) {
  const [isReplyCommentSelected, setIsReplyCommentSelected] = useState<
    CommentsTaskResponse | undefined
  >()

  const handleClickEdit = (comment: CommentsTaskResponse) => {
    setIsShowMarkdownEditReplyComment(true)
    setIsShowMarkdownComment(false)
    setIsShowMarkdownPostComment(false)
    setIsShowMarkdownReplyComment(false)
    handleEditComment(comment)
    setIsReplyCommentSelected(comment)
  }
  const handleClickCancelComment = () => {
    setIsShowMarkdownEditReplyComment(false)
  }

  return (
    <>
      {commentData.map((comment: CommentsTaskResponse) => (
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
          <Grid
            item
            xs={11}
            sx={{
              '& .MuiBox-root': { marginTop: 0 },
              '& .MuiDialogActions-root': { paddingBottom: 0 },
            }}
          >
            {isReplyCommentSelected?.id === comment.id && data && isShowMarkdownEditReplyComment ? (
              <TaskMarkdown
                contentMarkdown={comment.content}
                handleChange={handleChangeComment}
                handleClickSave={handleClickSaveComment}
                handleClickCancel={handleClickCancelComment}
                data={data}
                refetch={refetch}
              />
            ) : (
              <>
                <p style={{ margin: 0, marginBottom: '0.2rem', fontWeight: '600' }}>
                  {comment.user.firstName + ' ' + comment.user.lastName}
                  <span style={{ fontSize: '0.8rem', color: 'rgba(46, 46, 46, 0.85)' }}>
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
                <div
                  style={{
                    marginTop: '0.2rem',
                    color: 'rgb(46 46 46 / 85%)',
                    fontSize: '0.9rem',
                  }}
                >
                  {auth.username === comment.user.email && (
                    <>
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
                  <style>{`
                .text{
                  text-decoration: underline;
                }
                .text:hover{
                    color: black;
                    cursor: pointer;
                }`}</style>
                </div>
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  )
}
