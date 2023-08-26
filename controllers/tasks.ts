import { Request, Response } from "express"

import { Task } from "../models"
import { TASKS_CONSTANTS } from "../config/constants"
import { CustomRequest, IProject } from "../interfaces"


export const newTask = async( req: Request, res: Response ) => {

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

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

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

        if( !task ){
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        if( user._id?.toString() !== (task.project as IProject).creator.toString() ){
            return res.status(403).json('Tarea no encontrada - No autorizado')
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

    try {
            
        return res.status(200).json({
            msg: 'completeTask - Controller'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}


