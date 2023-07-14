
import jwt from 'jsonwebtoken'

export const generateJWT = (id: string) => {

    if( !process.env.JWT_SECRET_KEY ){
        throw new Error('JWT_SECRET_KEY requerida - Revisar variables de entorno')
    }

    const payload = { id }

    return jwt.sign(
        payload, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '30d' }
    )
}