import { Gender } from '../user/userEnum'

export interface UpdateUserProfileRequest {
  key: string
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  gender: Gender
}
