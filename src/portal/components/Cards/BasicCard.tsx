import { CardActionArea } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import * as React from 'react'

import { randomBackgroundColor } from '@/commons/helpers/randomBackgroundColor'

interface IProps {
  id: string
  title: string
  description?: string
  onClick: (id: string) => void
}

const BasicCard = ({ id, title, description, onClick }: IProps) => {
  return (
    <Card key={id} sx={{ width: 210, height: 95, ...randomBackgroundColor(id) }}>
      <CardActionArea
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: '#00000096',
        }}
        onClick={() => onClick(id)}
      >
        <CardContent sx={{ height: '100%', width: '100%' }}>
          <Typography gutterBottom noWrap variant="h5" component="div" color="white">
            {title}
          </Typography>
          {description && description != 'string' && (
            <Typography
              sx={{
                width: '100%',
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
                color: 'white',
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
  )
}
export default BasicCard
