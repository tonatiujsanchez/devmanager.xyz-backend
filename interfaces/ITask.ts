import { IProject } from "./IProject"
import { IUser } from "./IUser"


export interface ITask {
    _id?        : string

    name        : string
    description : string
    completed   : boolean
    deliveryDate: Date
    priority    : PriorityTask
    project     : IProject | string
    completedBy?: IUser | string

    status      : boolean

    createdAt?  : string
    updatedAt?  : string
}


export type PriorityTask = 'low' | 'medium' | 'high'