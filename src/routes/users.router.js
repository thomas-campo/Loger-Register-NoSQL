import { Router } from 'express'
import userController from '../controllers/users.controller.js'

const router = Router();

router.get('/',userController.getUsers)

router.put('/premium/:uid',userController.changeRole);

router.delete(`/:uid`,userController.deleteUser)

export default router;