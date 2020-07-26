import { IUser } from 'src/common/auth/users/user.interface'
import { IImage } from './image.interface'

export interface IPerson extends IUser {
  name: string
  contact: string
  email: string
  isVerified: boolean
  image: IImage
  scope: [string]
}
