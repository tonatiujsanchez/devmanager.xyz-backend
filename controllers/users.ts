import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { User } from "../models"



export const registerUser = async( req:Request, res: Response )=>{

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
            password
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