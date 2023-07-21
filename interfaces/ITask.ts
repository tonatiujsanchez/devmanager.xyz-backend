import { IProject } from "./IProject"


export interface ITask {
    _id?        : string

    name        : string
    description : string
    completed   : boolean
    deliveryDate: Date
    priority    : PriorityTask
    project     : IProject | string

    status      : boolean

    createdAt?  : string
    updatedAt?  : string
}


export type PriorityTask = 'low' | 'medium' | 'high'