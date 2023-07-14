
import { Router } from 'express'
import { register, login, confirm } from '../controllers/users'

const router = Router()


router.post('/', register)

router.post('/login', login)

router.get('/confirm/:token', confirm)




export default router