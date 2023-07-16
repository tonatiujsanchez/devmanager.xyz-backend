import { IUser } from "./IUser"


export interface IProject {
    _id?     : string

    name         : string
    description  : string
    deliveryDate : Date
    client       : string
    creator      : IUser | string,
    collaborators: IUser[] | string[]

    status       : boolean

    createdAt?: string
    updatedAt?: string
}