import { Request } from "express"

export interface IUser {
    _id?     : string
 
    name     : string
    password : string
    email    : string
    token?   : string | null

    confirmed: boolean
    status   : boolean

    createdAt?: string
    updatedAt?: string


    checkPassword: ( password:string ) => Promise<boolean>
}

export interface CustomRequest extends Request {
    user: IUser
}