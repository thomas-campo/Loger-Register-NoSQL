import { Router } from "express";
import passport from "passport";
import UserManager from "../dao/mongo/manager/UserManagerMongo.js";
import { createHash, validatePassword } from "../utils.js";
import userModel from "../dao/mongo/models/user.js";
import sessionController from "../controllers/session.controller.js";

const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail',failureMessage:true}),sessionController.register)
router.get('/registerFail',sessionController.registerFailed)

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail', failureMessage:true}),sessionController.login)
router.get('/loginFail',sessionController.loginFailed)

router.get('/logout',sessionController.logout);

router.get('/github',passport.authenticate('github'),(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github'),sessionController.githubCallback)

router.post('/restorePassword',async(req,res)=>{
    const {email,password} = req.body;
    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send({status:"error",error:"Usuario no encontrado"});
    const samePassword = await validatePassword(password,user.password);
    if(samePassword) return res.status(400).send({status:"error",error:"Escribiste la misma contraseña"});
    const newHasedPassword = await createHash(password);
    await userModel.updateOne({email},{$set:{password:newHasedPassword}});
    res.status(200).send({ status: 'success'});
})

export default router;