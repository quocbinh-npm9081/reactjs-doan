import moment from 'moment'

export function formatDate(date: Date | string) {
  return moment(date).format('MMM Do, YYYY')
}
export function formatDateTime(date: Date | string) {
  return moment(date).format('MMM Do, YYYY hh:mm a')
}
export function firstUpercase(text: string) {
  return text.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase())
}
