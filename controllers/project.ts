import { Request, Response } from "express"
import { CustomRequest } from "../interfaces"



export const getProjects = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest

    return res.status(200).json({
        msg: 'getProjects Controller',
        user
    })
}

export const newProject = async( req: Request, res: Response ) => {
    return res.status(201).json({
        msg: 'newProject Controller'
    })
}

export const getProject = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'getProject Controller'
    })
}

export const editProject = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'getProject Controller'
    })
}

export const deleteProject = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'deleteProject Controller'
    })
}

export const addCollaboratorToproject = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'addCollaboratorToproject Controller'
    })
}

export const deleteCollaboratorFromproject = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'deleteCollaboratorFromproject Controller'
    })
}

export const getTasksFromProject = ( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'getTasksFromProject Controller'
    })
}