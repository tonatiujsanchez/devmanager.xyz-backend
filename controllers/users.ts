import { Request, Response } from "express"
import { User } from "../models"
import { generateId, generateJWT } from "../helpers"



export const register = async( req:Request, res: Response )=>{

    const { name, email, password } = req.body

    try {

        const userDB = await User.findOne({ email }).lean()

        if( userDB ){
            return res.status(400).json({
                msg: `Ya hay un usuario registrado con el correro: ${ email }`
            })
        }

        const user = await new User({
            name, 
            email, 
            password,
            token: generateId()
        })

        await user.save()

        return res.status(200).json(user)

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Error en el servidor, hable con el adminstrador'
        })
        
    }
}


export const login = async( req:Request, res: Response ) => {

    const { email, password } = req.body

    try {

        const user = await User.findOne({ email, status: true })

        if( !user ){
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            })
        }

        if( !user.confirmed ){
            return res.status(403).json({
                msg: 'Tu cuenta no a sido confirmada'
            })
        }

        const isValidPassword = await user.checkPassword( password )

        if( !isValidPassword ){
            return res.status(403).json({
                msg: 'Contraseña incorrecta'
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
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}


export const confirm = async( req:Request, res:Response ) => {

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
            msg: 'Error en el servidor, hable con el adminstrador'
        })
    }
}