import jwt from 'jsonwebtoken';
import { createHash, validatePassword } from "../utils.js";
import userModel from "../dao/mongo/models/user.js";
import { UserService } from "../services/service.js";
import MailingService from "../services/mailingService.js";
import DTemplates from "../constants/DTemplates.js";
import { generateToken } from "../services/auth.js";
import RestoreTokenDTO from "../dto/restoreTokenDTO.js";
import config from '../config/config.js';

const register = async(req,res)=>{
    res.send({status:"success",message:"registrado"});
}

const registerFailed = (req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages})
}

const login = async(req,res)=>{
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    console.log(req.session)
    
    res.status(200).send({ status: 'success'});
}

const loginFailed = (req,res)=>{
    console.log(req.session.messages);
    if(req.session.messages.length>4) return res.status(400).send({message:"se bloquearon los intentos de login"})
    res.status(400).send({status:"error",error:req.session.messages});
}

const logout = async(req,res)=>{
    req.session.destroy(err =>{
        if(!err){
            res.redirect('/login');
        }
        else res.send({status:'error al cerrar sesion',body: err})
    });
}

const github = (req,res)=>{}

const githubCallback = (req,res)=>{
    const user = req.user;
    req.session.user={
        id:user.id,
        name:user.first_name,
        rol:user.rol,
        email:user.email
    }
    res.status(200).redirect('/products');
}

const restoreRequest = async(req,res)=>{
    const {email} = req.body;
    if(!email) return res.status(400).send({status:"error",error:"no se proporciono un correo"});
    const user = await UserService.getUserByService({email});
    if(!user) return res.status(400).send({status:"error",error:"Este correo no esta asociado a una cuenta"});
    const restoreToken = generateToken(RestoreTokenDTO.getFrom(user));
    console.log(restoreToken)
    const mailingService = new MailingService();
    const result = await mailingService.sendMail(user.email,DTemplates.RESTORE,{restoreToken});
    console.log(result);
    res.send({ status: 'success'});
}

const restorePassword = async(req,res)=>{
    const {password,token} = req.body;
    try{
        const tokenUser = jwt.verify(token,config.jwt.SECRET);
        const user = await UserService.getUserByService({email: tokenUser.email});
        const isSamePassword = await validatePassword(password,user.password);
        if(isSamePassword) return res.status(400).send({status:"error",error:"su contraseña es la misma"});
        const newHashedPassword = await createHash(password);
        await UserService.update(user._id,{password:newHashedPassword})
        res.send({status:"success",message:"Contraseña cambiada"});
    }catch(error){
        console.log(error);
    }
}

export default {
    register,
    registerFailed,
    login,
    loginFailed,
    logout,
    github,
    githubCallback,
    restoreRequest,
    restorePassword
}