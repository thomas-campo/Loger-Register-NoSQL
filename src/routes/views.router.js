import { Router } from "express";
import { privacity } from "../middlewares/auth.js";
import viewsController from "../controllers/views.controller.js";

const router = Router();



router.get('/',viewsController.getHome)

router.get('/products',viewsController.getProducts)

router.get('/cart/:cid',viewsController.getCartById);

router.get('/register',privacity('NO_AUTHENTICATED'),(req,res)=>{
    res.render('register');
})

router.get('/login',privacity('NO_AUTHENTICATED'),(req,res)=>{
    res.render('login');
})

router.get('/profile',privacity('PRIVATE'),async(req,res)=>{
    res.render('profile',{
        user:req.session.user
    })
})

router.get('/restorePassword',privacity('NO_AUTHENTICATED'),(req,res)=>{
    res.render('restorePassword')
})

export default router;