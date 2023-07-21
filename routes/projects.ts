
import { Router } from 'express'

import { 
    getProjects, 
    newProject, 
    getProject, 
    editProject, 
    deleteProject, 
    getTasksFromProject, 
    addCollaboratorToproject, 
    deleteCollaboratorFromproject, 
} from '../controllers/projects'
import { checkAuth, esMongoId, existsProjectById } from '../middlewares'

const router = Router()


router.route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject)

router.route('/:id')
    .get(checkAuth, esMongoId, getProject)
    .put(checkAuth, esMongoId, editProject)
    .delete(checkAuth, esMongoId, deleteProject)

router.get('/tasks/:id', checkAuth, existsProjectById, getTasksFromProject)

router.post('add-collaborator', checkAuth, addCollaboratorToproject)
router.post('delete-collaborator', checkAuth, deleteCollaboratorFromproject)


export default router