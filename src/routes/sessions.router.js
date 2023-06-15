import { Router } from "express";
import passport from "passport";

const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail'}),async(req,res)=>{
    res.send({status:"success",message:"registrado"});
})
router.get('/registerFail',(req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages})
})

router.post('/login',passport.authenticate('login',{failureRedirect:'/api/sessions/loginFail'}),async(req,res)=>{
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    res.status(200).send({ status: 'success'});
})
router.get('/loginFail',(req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages});
})

router.get('/logout',async(req,res)=>{
    req.session.destroy(err =>{
        if(!err){
            res.redirect('/login');
        }
        else res.send({status:'error al cerrar sesion',body: err})
    });
});

router.get('/github',passport.authenticate('github'),(req,res)=>{})

router.get('/githubcallback',passport.authenticate('github'),(req,res)=>{
    const user = req.user;
    req.session.user={
        id:user.id,
        name:user.first_name,
        rol:user.rol,
        email:user.email
    }
    res.send({status:"success",message:"logueado con GitHub"});
})

export default router;