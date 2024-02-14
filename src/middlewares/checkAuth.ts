import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { User } from "../models"
import { CustomRequest } from "../interfaces"



export const checkAuth = async( req:Request, res:Response, next:NextFunction ) => {
    
    let token = req.headers.authorization    
    
    if( !process.env.JWT_SECRET_KEY ){
        throw new Error('JWT_SECRET_KEY requerida - Revisar variables de entorno')
    }

    if( !token ) {
        return res.status(400).json({
            msg: 'Token requerido'
        })
    }

    try {

        token = token.split(' ')[1]

        const { id } = jwt.verify( token, process.env.JWT_SECRET_KEY ) as { id: string,  iat: number, exp: number }

        const user = await User.findById(id).select('-password').lean()

        if( !user ){
            return res.status(401).json({
                msg: 'No autorizado - Usuario no encontrado'
            })
        }

        if( !user.confirmed ){
            return res.status(403).json({
                msg: 'No autorizado - Cuenta no confirmada'
            })
        }
        
        if( !user.status ){
            return res.status(401).json({
                msg: 'No autorizado - Usuario no encontrado'
            })
        }

        (req as CustomRequest).user = user

        next()
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg: 'No autorizado - Token no Válido'
        })
    }
    
}