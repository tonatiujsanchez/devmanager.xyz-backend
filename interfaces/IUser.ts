

export interface IUser {
    _id?     : string
 
    name     : string
    password : string
    email    : string
    token?   : string

    confirmed: boolean
    status   : boolean

    createdAt?: string
    updatedAt?: string
}