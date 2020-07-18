import {IUser} from "../../common/auth/users/user.interface";
import {ILocation} from "./location.interface";
import {IImage} from "./image.interface";

export interface IShopRegistrationInterface extends IUser{
   name: string,
   location: ILocation
   images: [IImage],
   contact: string,
   email: string,
   address: string,
   parent: string,
   city: string,
   services : [string],
   status: string
}