import { Request, Response } from "express"


export const searchCollaboratorByEmail = async( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'searchCollaborator Controller',
        body: req.body
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
