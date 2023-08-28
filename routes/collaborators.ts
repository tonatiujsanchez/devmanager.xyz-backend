
import { Router } from 'express'

import { 
    addCollaboratorToproject, 
    deleteCollaboratorFromproject, 
    searchCollaboratorByEmail 
} from '../controllers/collaborators'
import { checkAuth } from '../middlewares'

const router = Router()


router.post('/', checkAuth, searchCollaboratorByEmail)
router.post('/:id', checkAuth, addCollaboratorToproject)
router.delete('/:id', checkAuth, deleteCollaboratorFromproject)

export default router
