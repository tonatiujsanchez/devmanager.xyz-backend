import { Request, Response } from "express"
import { CustomRequest } from "../interfaces"
import { Project } from "../models"


export const getProjects = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { page = 1, count = 10 } = req.query


    let pageNum = Number(page)
    let countNum = Number(count)

    if( isNaN(pageNum) ){
        return res.status(400).json({
            msg: 'Las propiedad page debe ser un número'
        })
    }

    if( isNaN(countNum) ){
        return res.status(400).json({
            msg: 'Las propiedad limit debe ser un número'
        })
    }
    
    if( pageNum <= 0 ){ 
        pageNum = 1 
    }

    if( countNum <= 0 ){ 
        countNum = 10 
    }

    const skip = ( pageNum - 1 ) * countNum
    const limit = countNum
     
    const query = { status: true }

    try {

        const [ projects, total ] = await Promise.all([
                Project.find(query)
                    .where('creator').equals(user)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Project.find(query)
                    .where('creator').equals(user)
                    .countDocuments(query)
        ]) 
        
        return res.status(200).json({
            page: pageNum,
            count: projects.length,
            total,
            totalPages: Math.ceil(total / countNum),
            projects
        })
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }


}

export const newProject = async( req: Request, res: Response ) => {
    
    const { name='', description='', client='' } = req.body
    const { user } = req as CustomRequest

    if(name.trim() === ''){
        return res.status(404).json({
            msg: 'El nombre del proyecto es requerido'
        })
    }

    if(description.trim() === ''){
        return res.status(404).json({
            msg: 'La descripción del proyecto es requerido'
        })
    }

    if(client.trim() === ''){
        return res.status(404).json({
            msg: 'El cliente del proyecto es requerido'
        })
    }

    try {

        const proyect = new Project({
            name, 
            description, 
            client,
            creator: user._id
        })

        await proyect.save()
        
        return res.status(201).json(proyect)
    } catch (error) {
        
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
        
    }
    
}

export const getProject = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {

        const proyect = await Project.findById(id)
            .where('status').equals(true)

        if( !proyect ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        if( !(user._id?.toString() === proyect.creator.toString()) ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }
        
        return res.status(200).json(proyect)
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
        
    }

}

export const editProject = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { name='', description='', deliveryDate='', client='' } = req.body
    const { id } = req.params

    try {
        
        const proyect = await Project.findById(id)
            .where('status').equals(true)

        if( !proyect ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        if( !(user._id?.toString() === proyect.creator.toString()) ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        proyect.name         = name.trim() === '' ? proyect.name : name
        proyect.description  = description.trim() === '' ? proyect.description : description
        proyect.deliveryDate = deliveryDate.trim() === '' ? proyect.deliveryDate : deliveryDate
        proyect.client       = client.trim() === '' ? proyect.client : client

        await proyect.save()

        return res.status(200).json(proyect)

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })

    }
}

export const deleteProject = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {
        const proyect = await Project.findById(id)
            .where('status').equals(true)

        if( !proyect ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        if( !(user._id?.toString() === proyect.creator.toString()) ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        proyect.status = false
        await proyect.save()

        return res.status(200).json(proyect)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
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

export const getTasksFromProject = ( req: Request, res: Response ) => {
    return res.status(200).json({
        msg: 'getTasksFromProject Controller'
    })
}