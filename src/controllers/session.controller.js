import jwt from 'jsonwebtoken';
import { createHash, validatePassword } from "../utils.js";

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
    res.status(400).send({status:"error",error:req.session.messages})
}

const login = async(req,res)=>{
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    res.status(200).send({ status: 'success'});
}

const loginFailed = (req,res)=>{
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
        name:user.name,
        role:user.role,
        email:user.email
    }
    res.status(200).redirect('/products');
}

const restoreRequest = async(req,res)=>{
    const {email} = req.body;
    if(!email) return res.status(400).send({status:"error",error:"no se proporciono un correo"});
    const user = await UserService.getUserByEmail(email);
    if(!user) return res.status(400).send({status:"error",error:"Este correo no esta asociado a una cuenta"});
    const restoreToken = generateToken(RestoreTokenDTO.getFrom(user),'1h');
    const mailingService = new MailingService();
    await mailingService.sendMail(user.email,DTemplates.RESTORE,{restoreToken});
    res.send({ status: 'success'});
}

const restorePassword = async(req,res)=>{
    try{
        const {password,token} = req.body;

        const expresiones = {
            password: /^[a-zA-Z0-9]{3,12}$/
        }
    
        if(!expresiones.password.test(password)) return res.send({status:"error",error:"Valores incorrectos"})

        const tokenUser = jwt.verify(token,config.jwt.SECRET);

        const user = await UserService.getUserByEmail(tokenUser.email);

        const isSamePassword = await validatePassword(password,user.password);

        if(isSamePassword) return res.status(400).send({status:"error",error:"su contraseña es la misma"});

        const newHashedPassword = await createHash(password);

        await UserService.updatePasswordById(user._id,newHashedPassword)

        res.send({status:"success",message:"Contraseña cambiada"});
    }catch(error){
        console.log(error);
    }
}

const ticketMailing = async(req,res)=>{
    if(!req.session.user) return res.redirect(`/login`);
    const user = req.session.user;
    const payload = req.body;
    const mailingService = new MailingService();
    await mailingService.sendMail(user.email,DTemplates.TICKET,{payload});
    return res.send({payload:payload});
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
    restorePassword,
    ticketMailing
}