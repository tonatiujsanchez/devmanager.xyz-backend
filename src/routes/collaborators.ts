
import { Router } from 'express'

import { 
    addCollaboratorToProject, 
    deleteCollaboratorFromproject, 
    searchCollaboratorByEmail 
} from '../controllers/collaborators'
import { checkAuth, esMongoId } from '../middlewares'

const router = Router()


router.post('/', checkAuth, searchCollaboratorByEmail)
router.post('/:id', checkAuth, esMongoId, addCollaboratorToProject)
router.delete('/:id', checkAuth, deleteCollaboratorFromproject)

export default router
