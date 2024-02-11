import { Request } from "express"
import { IProject } from "./IProject"

export interface IUser {
    _id?     : string
 
    name     : string
    password : string
    email    : string
    photo    : string | null
    
    token?   : string | null

    facebook : boolean
    google   : boolean
    twitter  : boolean
    github   : boolean

    confirmed: boolean
    status   : boolean

    createdAt?: string
    updatedAt?: string


    checkPassword: ( password:string ) => Promise<boolean>
}

export interface CustomRequest extends Request {
    user: IUser
    project: IProject
}