import { Gender } from '@/types/user/userEnum'

export interface UpdateUserProfileRequest {
  firstName: string
  lastName: string
  phoneNumber: string
  gender: Gender
}
