import { Schema, Model, model, models } from 'mongoose'
import bcrypt from 'bcrypt'

import { IUser } from '../interfaces'


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    token: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})


UserSchema.pre('save', async function( next ) {

    if( !this.isModified('password') ){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash( this.password, salt )

})

UserSchema.methods.checkPassword = async function( passwordBody:string ):Promise<boolean> {
    return await bcrypt.compare( passwordBody, this.password )
}

const User:Model<IUser> = models.User || model('User', UserSchema)

export default User