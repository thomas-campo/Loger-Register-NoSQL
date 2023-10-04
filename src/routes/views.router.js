import { Router } from "express";
import { privacity } from "../middlewares/auth.js";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get('/',privacity('NO_AUTHENTICATED'),viewsController.getHome);

router.get('/products',privacity('PRIVATE'),viewsController.getProducts);

router.get('/users',privacity('PRIVATE'),viewsController.getUsers);

router.get('/cart/:cid',privacity('PRIVATE'),viewsController.getCartById);

router.get('/register',privacity('NO_AUTHENTICATED'),viewsController.getRegister);

router.get('/login',privacity('NO_AUTHENTICATED'),viewsController.getLogin);

router.get('/profile',privacity('PRIVATE'),viewsController.getProfile);

router.get('/restoreRequest',privacity('PUBLIC'),viewsController.getRestoreRequest);

router.get('/restorePassword',privacity('PUBLIC'),viewsController.getRestorePassword);

router.get('/createProduct',privacity('PRIVATE'),viewsController.getCreateProduct);

router.get('/updateProduct',privacity('PRIVATE'),viewsController.getUpdateProduct);

router.get('/deleteProduct',privacity('PRIVATE'),viewsController.getDeleteProduct);

router.get('/purchase/:cid',privacity('PRIVATE'),viewsController.getPuncharse);

export default router;