import { Router } from "express";
import passport from "passport";
import sessionController from "../controllers/session.controller.js";

const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail',failureMessage:true}),sessionController.register);

router.get('/registerFail',sessionController.registerFailed);

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail', failureMessage:true}),sessionController.login);

router.get('/loginFail',sessionController.loginFailed);

router.get('/logout',sessionController.logout);

router.get('/github',passport.authenticate('github'),sessionController.github);

router.get('/githubcallback',passport.authenticate('github'),sessionController.githubCallback);

router.post('/restoreRequest',sessionController.restoreRequest);

router.post('/restorePassword',sessionController.restorePassword);

router.post('/ticketMail',sessionController.ticketMailing);

export default router;