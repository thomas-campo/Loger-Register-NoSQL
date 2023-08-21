import { Router } from "express";
import { privacity } from "../middlewares/auth.js";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get('/',privacity('PUBLIC'),viewsController.getHome);

router.get('/products',privacity('PRIVATE'),viewsController.getProducts);

router.get('/cart/:cid',privacity('PRIVATE'),viewsController.getCartById);

router.get('/register',privacity('NO_AUTHENTICATED'),viewsController.getRegister);

router.get('/login',privacity('NO_AUTHENTICATED'),viewsController.getLogin);

router.get('/profile',privacity('PRIVATE'),viewsController.getProfile);

router.get('/restoreRequest',privacity('PUBLIC'),viewsController.getRestoreRequest);

router.get('/restorePassword',privacity('PUBLIC'),viewsController.getRestorePassword);

router.get('/createProduct',viewsController.getCreateProduct);

router.get('/updateProduct',viewsController.getUpdateProduct);

router.get('/deleteProduct',viewsController.getDeleteProduct);

export default router;