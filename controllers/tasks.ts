import { Request, Response } from "express"

import { Task } from "../models"
import { TASKS_CONSTANTS } from "../config/constants"
import { CustomRequest, IProject, IUser } from "../interfaces"


export const newTask = async( req: Request, res: Response ) => {

    const { user, project:projectReq } = req as CustomRequest

    // Validar que el creador del proyecto sea el mismo que intenta crear una tarea
    if( user._id?.toString() !== projectReq.creator?.toString() ){
        return res.status(400).json({
            msg: 'Proyecto no encontrado - No autorizado!!!'
        })
    }

    const { name = '', description = '', deliveryDate, priority=undefined, project } = req.body

    if(name.trim() === ''){
        return res.status(400).json({
            msg: 'El nombre de la tarea es requerido'
        })
    }

    if(description.trim() === ''){
        return res.status(400).json({
            msg: 'La descripción de la tarea es requerida'
        })
    }

    if( priority && !TASKS_CONSTANTS.validPriority.includes( priority.toString() ) ){
        return res.status(400).json({
            msg: `${priority} no es una prioridad válida`
        })
    }

    try {
    
        const task = new Task({
            name, 
            description,
            deliveryDate,
            priority,
            project
        })

        await task.save()

        return res.status(201).json(task)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const getTask = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {
        
        const task = await Task.findById(id)
            .where('status').equals(true)
            .populate('project', 'name creator')
            .populate('completedBy', 'name email photo')

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        // Validar que el creador del proyecto sea el mismo que intenta obtener una tarea
        if( user._id?.toString() !== (task.project as IProject).creator.toString() ){
            return res.status(403).json('Tarea no encontrada - No autorizado')
        }
        
        return res.status(200).json(task)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const editTask = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { name = '', description = '', deliveryDate='', priority=undefined } = req.body
    const { id } = req.params

    try {

        if( priority && !TASKS_CONSTANTS.validPriority.includes( priority.toString() ) ){
            return res.status(400).json({
                msg: `${priority} no es una prioridad válida`
            })
        }    

        const task = await Task.findById(id)
            .where('status').equals(true)
            .populate('project', 'name creator')
            .populate('completedBy', 'name email photo')

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }
        
        // Validar que el creador del proyecto sea el mismo que intenta actualizar una tarea
        if( user._id?.toString() !== (task.project as IProject).creator.toString() ){
            return res.status(403).json({
                msg: 'Tarea no encontrada - No autorizado'
            })
        }

        task.name        = name.trim() === '' ? task.name : name
        task.description = description.trim() === '' ? task.description : description
        task.priority    = !priority ? task.priority : priority
        task.deliveryDate= deliveryDate.trim() === '' ? task.deliveryDate : deliveryDate

        await task.save()
            
        return res.status(200).json(task)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const deleteTask = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {

        const task = await Task.findById(id)
            .where('status').equals(true)
            .populate('project', 'creator')

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        // Validar que el creador del proyecto sea el mismo que intenta eliminar una tarea
        if( user._id?.toString() !== (task.project as IProject).creator.toString() ){
            return res.status(403).json('Tarea no encontrada - No autorizado')
        }

        await task.deleteOne()
            
        return res.status(200).json(task)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const completeTask = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    const { id } = req.params

    try {

        const task = await Task.findById(id)
            .where('status').equals(true)
            .populate('project', 'creator collaborators')

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        // Comprobar que el colaborador no pertenezca al proyecto
        const { project } = task as { project: IProject }
        const findCollaborator = (project.collaborators as string[]).find( IdCollaborator => IdCollaborator.toString() === user._id!.toString() )


        if( user._id?.toString() !== project.creator.toString() && !findCollaborator ){
            return res.status(401).json({
                msg: 'Proyecto no encontrado - Acción no válida'
            })
        }

        task.completed = !task.completed


        const newTask = await Task.findOneAndUpdate(
            { _id: task._id }, 
            { completed: task.completed, completedBy: task.completed ? user : null }, 
            { new: true }
        ).populate('completedBy', 'name email photo')
            
        return res.status(200).json(newTask)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}


