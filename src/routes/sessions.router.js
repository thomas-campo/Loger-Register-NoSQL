import { Router } from "express";
import userModel from "../dao/mongo/models/user.js";

const router = Router();

router.post('/register',async(req,res)=>{
    const result = await userModel.create(req.body);
    res.send({status:"success",payload:result});
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    if(email==="adminCoder@coder.com"&&password==="123"){
        req.session.user = {
            name: 'Admin',
            role:"admin",
            email:'...'
        }
        
        return res.sendStatus(200);
    }

    const user = await userModel.findOne({email,password});
    if(!user) return res.status(400).send({status:"error",error:"Usuario o contraseña incorrecta"});
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email:user.email
    }
    res.status(200).send({ status: 'success'});
})

router.get('/logout',async(req,res)=>{
    req.session.destroy(err =>{
        if(!err){
            res.redirect('/login');
        }
        else res.send({status:'error al cerrar sesion',body: err})
    });
});

export default router;