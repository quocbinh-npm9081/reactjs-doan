import { Gender, Privilege, Role } from '@/types/user/userEnum'

export interface CreateUserRequest {
  firstName: string
  lastName: string
  username: string
  password: string
  phoneNumber: string
  gender: Gender
  role: Role
  privileges: Privilege[]
}
