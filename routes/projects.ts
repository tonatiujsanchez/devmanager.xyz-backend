
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
} from '../controllers/project'
import { checkAuth } from '../middlewares'

const router = Router()


router.route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject)

router.route('/:id')
    .get(checkAuth, getProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject)

router.get('/tasks/:id', checkAuth, getTasksFromProject)

router.post('add-collaborator', checkAuth, addCollaboratorToproject)
router.post('delete-collaborator', checkAuth, deleteCollaboratorFromproject)


export default router