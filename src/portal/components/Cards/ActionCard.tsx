import { CardActionArea } from '@mui/material'
import Box from '@mui/material/Box/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import * as React from 'react'

interface IProps {
  id?: string
  title?: string
  icon?: React.ReactElement
  onClick: () => void
  description?: string
}

const ActionCard = ({ id, title, icon, description, onClick }: IProps) => {
  return (
    <Box padding={2}>
      <Card
        key={String(id)}
        sx={{ width: 210, height: 95, backgroundColor: '#8080802e', display: 'block' }}
      >
        <CardActionArea sx={{ height: '100%' }} onClick={onClick}>
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {title && (
              <Typography
                gutterBottom
                noWrap
                variant="subtitle1"
                component="div"
                textAlign="center"
              >
                {title}
              </Typography>
            )}
            {icon && icon}

            {description && (
              <Typography
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: '3',
                  WebkitBoxOrient: 'vertical',
                }}
                variant="body2"
                color="text.secondary"
              >
                {description}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  )
}
export default ActionCard
