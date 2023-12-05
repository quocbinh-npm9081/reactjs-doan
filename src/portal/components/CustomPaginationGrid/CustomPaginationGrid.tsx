import { TablePaginationProps } from '@mui/material'
import MuiPagination from '@mui/material/Pagination'
import {
  gridPageSelector,
  gridPageSizeSelector,
  GridPagination,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid'

function Pagination({
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector)
  const totalElement = useGridSelector(apiRef, gridRowCountSelector)
  const pageCount = Math.ceil(totalElement / pageSize)

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        apiRef.current.setPage(newPage - 1)
        onPageChange(event as React.MouseEvent<HTMLButtonElement> | null, newPage - 1)
      }}
    />
  )
}
/* eslint-disable  @typescript-eslint/no-explicit-any */
export const CustomPaginationGrid = (props: any) => {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}
