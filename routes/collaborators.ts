
import { Router } from 'express'

import { 
    addCollaboratorToproject, 
    deleteCollaboratorFromproject, 
    searchCollaboratorByEmail 
} from '../controllers/collaborators'
import { checkAuth, esMongoId } from '../middlewares'

const router = Router()


router.post('/', checkAuth, searchCollaboratorByEmail)
router.post('/:id', checkAuth, esMongoId, addCollaboratorToproject)
router.delete('/:id', checkAuth, deleteCollaboratorFromproject)

export default router
