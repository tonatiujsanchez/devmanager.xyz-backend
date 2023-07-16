import { Model, Schema, models, model } from 'mongoose'
import { IProject } from '../interfaces'

const ProjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now()
    },
    client: {
        type: String,
        trim: true,
        required: true 
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collaborators: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})


const Project:Model<IProject> = models.Project || model('Project', ProjectSchema)


export default Project