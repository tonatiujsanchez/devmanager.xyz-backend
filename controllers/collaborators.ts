import { Request, Response } from "express"
import { isValidObjectId } from "mongoose"

import { Project, User } from "../models"
import { CustomRequest, IUser } from "../interfaces"


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



export const addCollaboratorToProject = async( req: Request, res: Response ) => {

    const { id } = req.params
    const { idCollaborator } = req.body

    const { user } = req as CustomRequest


    if( !isValidObjectId(idCollaborator) ){
        return res.status(400).json({
            msg: 'Id de colaborador no válido'
        })
    }
    
    try {

        const [ project, collaborator ] = await Promise.all([
            Project.findById(id)
                .where('status').equals(true)
                .populate('collaborators', 'name email photo'),
            User.findById(idCollaborator)
                .where('status').equals(true)
                .select('name email photo confirmed')
                .lean()
        ])

        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Comprobar que el usuario autenticado sea el creador del proyecto 
        if( user._id?.toString() !== project.creator.toString() ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        if( !collaborator ){
            return res.status(401).json({
                msg: 'Colaborador no encontrado'
            })
        }

        if( !collaborator.confirmed ){
            return res.status(403).json({
                msg: 'Cuenta de colaborador no confirmada'
            })
        }


        // Comprobar que el colaborador que se quiere agregar al proyecto no sea el administrador 
        if( user._id.toString() === collaborator._id.toString() ){
            return res.status(401).json({
                msg: 'Acción no válida'
            })
        }

        // Comprobar que el colaborador no pertenezca al proyecto
        const findCollaborator = (project.collaborators as IUser[]).find( collaboratorDB => collaboratorDB._id?.toString() === collaborator._id.toString() )
        if( findCollaborator ){
            return res.status(401).json({
                msg: 'Este usuario ya pertenece al proyecto'
            })
        }

        await Project.findOneAndUpdate(
            { _id: project._id }, 
            { collaborators:[...project.collaborators, collaborator] }, 
            { new: true }
        )
        
        return res.status(200).json({
            _id  : collaborator._id,
            name : collaborator.name,
            email: collaborator.email,
            photo: collaborator.photo
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }
}



export const deleteCollaboratorFromproject = async( req: Request, res: Response ) => {

    const { id } = req.params
    const { idCollaborator } = req.body

    const { user } = req as CustomRequest

    if( !isValidObjectId(idCollaborator) ){
        return res.status(400).json({
            msg: 'Id de colaborador no válido'
        })
    }
    
    try {
        
        const project = await Project.findById(id)
            .where('status').equals(true)
        
        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Comprobar que el usuario autenticado sea el creador del proyecto 
        if( user._id?.toString() !== project.creator.toString() ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Comprobar que el colaborador pertenezca al proyecto
        const findCollaborator = (project.collaborators as string[]).find( collaboratorDB => collaboratorDB.toString() === idCollaborator )
        if( !findCollaborator ){
            return res.status(401).json({
                msg: 'Colaborador no encontrado en este proyecto'
            })
        }

        await Project.findOneAndUpdate(
            { _id: project._id }, 
            { collaborators: (project.collaborators as string[]).filter( collaboratorDB => collaboratorDB.toString() !== idCollaborator  ) }, 
            { new: true }
        )

        return res.status(200).json({ idCollaborator })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}
