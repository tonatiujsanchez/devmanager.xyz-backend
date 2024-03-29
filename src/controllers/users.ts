import { Request, Response } from "express"

import { User } from "../models"
import { sendEmailForgotPassword, sendEmailRegister, generateId, generateJWT } from "../helpers"
import { CustomRequest } from "../interfaces"


export const register = async( req:Request, res: Response )=>{

    const { name, email, password } = req.body

    if( !name ){
        return res.status(404).json({
            msg: 'El nombre es requerido'
        })
    }

    if( !email ){
        return res.status(404).json({
            msg: 'El correo es requerido'
        })
    }

    if( !password ){
        return res.status(404).json({
            msg: 'La contraseña es requerida'
        })
    }

    try {

        const userDB = await User.findOne({ email: email.toLowerCase() }).lean()

        if( userDB && userDB.status ){
            return res.status(400).json({
                msg: `El correo ${ userDB.email } ya esta en uso`
            })
        }

        if( userDB && !userDB.status ){
            return res.status(400).json({
                msg: `Usuario bloqueado, hable con el administrador`
            })
        }             

        const user = await new User({
            name, 
            email, 
            password,
            token: generateId()
        })

        await user.save()

        
        sendEmailRegister({
            email: user.email, 
            name: user.name, 
            token: user.token!
        })

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


export const login = async( req:Request, res: Response ) => {

    const { email, password } = req.body
    
    if( !email ){
        return res.status(404).json({
            msg: 'El correo es requerido'
        })
    }

    if( !password ){
        return res.status(404).json({
            msg: 'La contraseña es requerida'
        })
    }

    try {

        const user = await User.findOne({ email: email.toLowerCase(), status: true })

        if( !user ){
            return res.status(404).json({
                msg: 'Correo y/o Contraseña incorrectos'
            })
        }

        if( !user.confirmed ){
            return res.status(403).json({
                msg: 'Tu cuenta no a sido confirmada, revisa tu correo'
            })
        }

        const isValidPassword = await user.checkPassword( password )

        if( !isValidPassword ){
            return res.status(403).json({
                msg: 'Correo y/o Contraseña incorrectos'
            })
        }
        
        const token = generateJWT(user._id)

        return res.status(200).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }
}


export const confirmAccount = async( req:Request, res:Response ) => {

    const { token } = req.params

    if(!token){
        return res.status(400).json({
            msg: 'Token requerido'
        })
    }

    try {

        const user = await User.findOne({ token, status: true })

        if( !user ){
            return res.status(400).json({
                msg:'Token no válido'
            })
        }

        user.confirmed = true
        user.token = null

        await user.save()

        return res.status(200).json({
            msg: 'Usuario confirmado correctamente'
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }
}


export const changePassword = async( req: Request, res:Response ) => {

    const { email } = req.body

    if( !email ){
        return res.status(400).json({
            msg: 'Email requerido'
        })
    }

    try {
        const user = await User.findOne({ email:email.toLowerCase(), status: true })

        if( !user ){
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            })
        }

        if( !user.confirmed ){
            return res.status(404).json({
                msg: 'Tu cuenta no a sido confirmada'
            })
        }
        
        user.token = generateId()
        await user.save()

        sendEmailForgotPassword({
            email: user.email, 
            name: user.name, 
            token: user.token
        })

        return res.status(200).json({
            msg: `Enviamos un correo a ${ user.email } con las instruciones para restablecer tu contraseña`
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}


export const checkPasswordToken = async( req: Request, res: Response ) => {

    const { token } = req.params
    
    if(!token){
        return res.status(400).json({
            msg: 'Token requerido'
        })
    }

    try {       

        const user = await User.findOne({ token, status: true })       

        if( !user ){
            return res.status(404).json({
                msg: 'Token no válido'
            })
        }
        
        return res.status(200).json({
            msg: 'TOKEN VÁLIDO'
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }

}


export const newPassword = async( req: Request, res: Response ) => {

    const { token } = req.params
    const { password } = req.body

    if( !token ){
        return res.status(400).json({
            msg: 'Token requerido'
        })
    }

    if( !password ){
        return res.status(400).json({
            msg: 'Nueva contraseña requerida'
        })
    }

    try {
    
        const user = await User.findOne({ token, status: true })       
    
        if( !user ){
            return res.status(404).json({
                msg: 'Token no valido'
            })
        }

        user.password = password
        user.token    = null

        await user.save()

        return res.status(200).json({
            msg: 'Su contraseña a sido actualizada correctamente',
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el administrador'
        })
    }
}


export const getPerfil = async( req: Request, res: Response ) => {

    const { user } = req as CustomRequest
    
    const token = generateJWT(user._id!)

    return res.status(200).json({
        user:{
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    })

}