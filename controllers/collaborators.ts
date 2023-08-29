import { Request, Response } from "express"

import { User } from "../models"
import { CustomRequest } from "../interfaces"


export const searchCollaboratorByEmail = async( req: Request, res: Response ) => {
    
    const { email } = req.body

    if( !email ){
        return res.status(404).json({
            msg: 'El correo es requerido'
        })
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() }).lean()

        if( !user ){
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            })
        }

        if( !user.confirmed ){
            return res.status(403).json({
                msg: 'Usuario no confirmado'
            })
        }

        if( user && !user.status ){
            return res.status(400).json({
                msg: `Usuario bloqueado`
            })
        }

        if( user._id.toString() === (req as CustomRequest).user._id?.toString() ){
            return res.status(400).json({
                msg: `Usuario no encontrado`
            })
        }
        
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }
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
