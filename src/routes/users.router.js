import { Router } from 'express'
import userController from '../controllers/users.controller.js'

const router = Router();

router.put('/premium/:uid',userController.changeRole);

export default router;