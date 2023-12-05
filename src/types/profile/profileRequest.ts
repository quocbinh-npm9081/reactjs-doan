import { Gender } from '../user/userEnum'

export type UseUpdateUserProfile = {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: Gender
}
