import { Request, Response } from "express"
import { CustomRequest, IUser } from "../interfaces"
import { Project, Task } from "../models"


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
     
    // const query = { 
    //     status: true,
    //     '$or': [
    //         { 'collaborators': { $in: user } },
    //         { 'creator': { $in: user } },
    //     ]
    // }

    const query = { 
        status: true
    }

    try {
        const [ projects, total ] = await Promise.all([
                Project.find(query)
                    .where('creator').equals(user)
                    .populate('collaborators', 'name email photo')
                    .populate('creator', 'name email photo')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 'desc' })
                    .lean(),
                Project.countDocuments(query)
                    .where('creator').equals(user)
                    
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
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}

export const getCollaborativeProjects = async( req: Request, res: Response ) => {

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
     
    const query = { 
        status: true,
        '$or': [
            { 'collaborators': { $in: user } },
        ]
    }

    try {
        const [ projects, total ] = await Promise.all([
                Project.find(query)
                    .populate('collaborators', 'name email photo')
                    .populate('creator', 'name email photo')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: 'desc' })
                    .lean(),
                Project.countDocuments(query)                    
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
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}

export const newProject = async( req: Request, res: Response ) => {
    
    const { name='', description='', deliveryDate, client='' } = req.body
    const { user } = req as CustomRequest

    if(name.trim() === ''){
        return res.status(400).json({
            msg: 'El nombre del proyecto es requerido'
        })
    }

    if(description.trim() === ''){
        return res.status(400).json({
            msg: 'La descripción del proyecto es requerido'
        })
    }

    if(client.trim() === ''){
        return res.status(400).json({
            msg: 'El cliente del proyecto es requerido'
        })
    }

    try {

        const project = new Project({
            name, 
            description,
            deliveryDate,
            client,
            creator: user._id
        })

        await project.save()
        
        return res.status(201).json({
            ...JSON.parse( JSON.stringify( project ) ),
            creator: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo,
            }
        })
    } catch (error) {
        
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
        
    }
    
}

export const getProject = async( req: Request, res: Response ) => {    

    const { user } = req as CustomRequest
    const { id } = req.params

    try {

        const project = await Project.findById(id)
            .populate('collaborators', 'name email photo')
            .populate('creator', 'name email photo')
            .where('status').equals(true)

        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Comprobar que el colaborador no pertenezca al proyecto
        const findCollaborator = (project.collaborators as IUser[]).find( collaboratorDB => collaboratorDB._id?.toString() === user._id!.toString() )

        const creator = project.creator as IUser
        if( !(user._id?.toString() === creator._id?.toString()) && !findCollaborator ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        return res.status(200).json(project)

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
        
    }

}

export const editProject = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { name='', description='', deliveryDate='', client='' } = req.body
    const { id } = req.params

    try {

        const project = await Project.findById(id)
            .populate('collaborators', 'name email photo')
            .populate('creator', 'name email photo')
            .where('status').equals(true)

        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        const creator = project.creator as IUser
        if( !(user._id?.toString() === creator._id?.toString()) ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        project.name         = name.trim() === '' ? project.name : name
        project.description  = description.trim() === '' ? project.description : description
        project.deliveryDate = deliveryDate.trim() === '' ? project.deliveryDate : deliveryDate
        project.client       = client.trim() === '' ? project.client : client

        await project.save()

        return res.status(200).json(project)

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })

    }
}

export const deleteProject = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {
        const project = await Project.findById(id)
            .where('status').equals(true)

        if( !project ){
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        if( !(user._id?.toString() === project.creator.toString()) ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado'
            })
        }

        project.status = false
        await project.save()

        return res.status(200).json(project)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    } 
}



export const searchProjects = async(req: Request, res: Response) => {

    const { searchTerm='' } = req.body
    const { user } = req as CustomRequest

    if( searchTerm.trim() === '' ){
        return res.status(404).json({
            msg: 'El termino de busqueda es requerido'
        })
    }

    try {
        const projects = await Project.find({
            status: true, 
            $and: [
                {
                    $or: [
                        { collaborators: { $in: user } },
                        { creator: { $in: user } },
                    ]
                },
                {
                    $or: [
                        { name: { $regex: new RegExp(searchTerm, "i") } },
                        { description: { $regex: new RegExp(searchTerm, "i") } },
                    ] 
                }
            ]
        }).lean()

        return res.status(200).json(projects)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}



export const getTasksFromProject = async( req: Request, res: Response ) => {

    const { id } = req.params
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

        const [ tasks, total, completedTasks ] = await Promise.all([
            Task.find(query)
                .where('project').equals(id)
                .populate('completedBy', 'name email photo')
                .skip(skip)
                .limit(limit)
                .lean(),
            Task.countDocuments(query)
                .where('project').equals(id),
            Task.countDocuments({...query, completed: true})
                .where('project').equals(id)
                
        ]) 

        return res.status(200).json({
            page: pageNum,
            count: tasks.length,
            total,
            totalPages: Math.ceil(total / countNum),
            tasks,
            completedTasks
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}