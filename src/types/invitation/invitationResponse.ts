import { Gender } from '../user/userEnum'

export interface updateProfileResponse {
  key: string
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  gender: Gender
}

export interface getInvitationsResponse {
  id: string
  used: boolean
  projectName: string
  inviter: {
    email: string
    firstName: string
    lastName: string
  }
  expiredTime: string
  key: string
}
