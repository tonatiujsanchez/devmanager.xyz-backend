import { Router } from 'express'

import { 
    newTask,
    getTask, 
    editTask, 
    deleteTask, 
    completeTask, 
} from '../controllers/tasks'
import { checkAuth, esMongoId } from '../middlewares'


const router = Router()


router.post('/', checkAuth, newTask)

router.route('/:id')
    .get(checkAuth, esMongoId, getTask)
    .put(checkAuth, esMongoId, editTask)
    .delete(checkAuth, esMongoId, deleteTask)

router.post('/to-complete/:id', checkAuth, esMongoId, completeTask)


export default router