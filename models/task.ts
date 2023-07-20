import { Model, Schema, model, models } from "mongoose"
import { ITaks } from "../interfaces"


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
        default: Date.now()
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high']
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})


const Task:Model<ITaks> = models.Task || model('Task', TaskSchema)

export default Task