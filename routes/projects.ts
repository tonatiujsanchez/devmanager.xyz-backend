
import { Router } from 'express'

import { 
    getProjects,
    getCollaborativeProjects, 
    newProject, 
    getProject, 
    editProject, 
    deleteProject, 
    getTasksFromProject,
} from '../controllers/projects'
import { checkAuth, esMongoId, existsProjectById } from '../middlewares'

const router = Router()


router.route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject)

router.get('/collaborative', checkAuth, getCollaborativeProjects)

router.route('/:id')
    .get(checkAuth, esMongoId, getProject)
    .put(checkAuth, esMongoId, editProject)
    .delete(checkAuth, esMongoId, deleteProject)

router.get('/tasks/:id', checkAuth, existsProjectById, getTasksFromProject)


export default router