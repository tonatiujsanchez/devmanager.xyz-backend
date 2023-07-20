import { Request, Response } from "express"
import { CustomRequest } from "../interfaces"
import { Task } from '../models'


export const newTask = async( req: Request, res: Response ) => {

    try {
    
        return res.status(200).json({
            msg: 'Add new Task - Controller'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const getTask = async( req: Request, res: Response ) => {

    try {
            
        return res.status(200).json({
            msg: 'getTask - Controller'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const editTask = async( req: Request, res: Response ) => {

    try {
            
        return res.status(200).json({
            msg: 'editTask - Controller'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}



export const deleteTask = async( req: Request, res: Response ) => {

    try {
            
        return res.status(200).json({
            msg: 'deleteTask - Controller'
        })
        
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


