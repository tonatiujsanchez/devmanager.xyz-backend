import { Model, Schema, model, models } from "mongoose"
import { ITask } from "../interfaces"


const TaskSchema = new Schema({
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
    completed: {
        type: Boolean,
        default: false
    },
    deliveryDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    completedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

TaskSchema.methods.toJSON = function(){
    const { __v, status, ...task } = this.toObject()
    return task
}


const Task:Model<ITask> = models.Task || model('Task', TaskSchema)

export default Task