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
        ref: 'User',
        required: true
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


ProjectSchema.methods.toJSON = function(){
    const { __v, status, ...project } = this.toObject()
    return project
}

const Project:Model<IProject> = models.Project || model('Project', ProjectSchema)


export default Project