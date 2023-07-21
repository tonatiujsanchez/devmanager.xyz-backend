import { NextFunction, Request, Response } from "express"
import { isValidObjectId } from "mongoose"

import { Project } from "../models"
import { CustomRequest } from "../interfaces"



export const existsProjectById = async( req: Request, res: Response, next: NextFunction ) => {

    const { user } = req as CustomRequest

    const { id:idParams } = req.params 
    const { project:idBody } = req.body
    
    let idProject = ''

    if( idParams ){
        idProject = idParams
    }else {
        idProject = idBody
    }

    if( !isValidObjectId(idProject) ){
        return res.status(404).json({
            msg: 'Proyecto no encontrado - ID'
        })
    }

    try {

        const project = await Project.findById(idProject)
            .where('status').equals(true)

        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }
        
        if( user._id?.toString() !== project.creator.toString() ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado - No autorizado'
            })
        }
    
        next()
        
    } catch (error) {
        console.log('existsProjectById =>', error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }


}