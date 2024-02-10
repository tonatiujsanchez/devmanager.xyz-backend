
import { Router } from 'express'
import { register, login, confirmAccount, changePassword, checkPasswordToken, newPassword, getPerfil } from '../controllers/users'
import { checkAuth } from '../middlewares'


const router = Router()


router.post('/', register)

router.post('/login', login)

router.get('/confirm/:token', confirmAccount)

router.post('/change-password/', changePassword)

router.route('/change-password/:token')
    .get(checkPasswordToken)
    .post(newPassword)

router.get('/perfil', checkAuth, getPerfil)


export default router