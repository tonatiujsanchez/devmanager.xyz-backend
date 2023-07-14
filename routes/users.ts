
import { Router } from 'express'
import { registerUser } from '../controllers/users'

const router = Router()


router.post('/', registerUser)




export default router