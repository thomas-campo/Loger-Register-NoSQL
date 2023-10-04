import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";

import { createHash, validatePassword } from "../utils.js";
import config from "./config.js"
import DtoUser from "../dto/user.js";

import { CartService, UserService } from "../services/service.js";
import DtoUserFront from "../dto/userFront.js";
import DtoUserGithubFront from "../dto/userGithubFront.js";
const localStrategy = local.Strategy;

const initializePassport = ()=>{
    passport.use('register',new localStrategy({passReqToCallback:true, usernameField:'email'},async(req,email,password,done)=>{
        try{
            const {first_name,last_name} = req.body;

            const expresiones = {
                nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
                password: /^[a-zA-Z0-9]{3,12}$/,
                email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            }

            console.log(expresiones.nombre.test(first_name),"firstname")
            console.log(expresiones.nombre.test(last_name),"lastname")
            console.log(expresiones.email.test(email),"email")
            console.log(expresiones.password.test(password),"password")
        
            if(!expresiones.nombre.test(first_name)||!expresiones.nombre.test(last_name)||!expresiones.email.test(email)||!expresiones.password.test(password)) return done(null, false, { message: 'valores incorrectos' });

            const exist = await UserService.getUserByEmail(email);

            if(exist) return done(null,false,{message:'Este usuario ya existe'});

            const hashedPassword = await createHash(password);//encriptamos la contraseña
            const user = new DtoUser(
                {
                    first_name,
                    last_name,
                    email,
                    password:hashedPassword
                }
            )   
            const result = await UserService.createUser(user);

            done(null,result)
        }catch(error){
            done(error);
        }
   }))

    passport.use('login',new localStrategy({ usernameField: 'email' },async (email, password, done) => {
        try{
            if (email === config.admin.EMAIL && password === config.admin.PASSWORD) {
                const user = {
                        id: 0,
                        name: `Admin`,
                        role: 'admin',
                        email: '...'
                    }
                return done(null, user);
            }
            let user;
      
            user = await UserService.getUserByEmail(email);
            if (!user) return done(null, false, { message: 'Email incorrecto' });

            const isValidPassword = await validatePassword(password, user.password);
            if (!isValidPassword) return done(null, false, { message: 'Contraseña incorrecta' });

            let existsCart = await CartService.getCartsByUser(user._id);

            async function handleCart() {
                try{
                    let newUserCart;
                    if (existsCart.length === 0) {
                        existsCart = await CartService.createCart({ uid: user._id, products: [] });
                        await UserService.updateCartInUser( user._id, existsCart._id);
                    }
                    return newUserCart;
                }catch(err){
                    console.log(err);
                }
            }
                    
            let cart = existsCart[0] ? existsCart[0]._id : await handleCart();
            
            user = new DtoUserFront(
                {
                    id: user._id,
                    first_name:user.first_name,
                    last_name:user.last_name,
                    email: user.email,
                    role: user.role,
                    cart
                }
            );
            return done(null, user);
        }catch(error){
            done(error);
        }
    }));

    passport.use('github', new GithubStrategy({

        clientID:config.github.ID,
        clientSecret:config.github.SECRET,
        callbackURL:config.github.URL

    },async(accessToken,refreshToken,profile,done)=>{
        try{
            const {name,email} = profile._json;

            let user = await UserService.getUserByEmail(email);
            if(!user){
                const newUser = {
                    first_name: name,
                    email,
                    role:"user",
                    password:''
                }
                const result = await UserService.createUser(newUser);

                let cart = await CartService.createCart({ uid: result._id, products: [] })

                const addCartUser = await UserService.updateCartInUser( result._id.toString() , cart._id.toString() )

                user = new DtoUserGithubFront(
                    {
                        name: addCartUser.first_name,
                        id: addCartUser._id,
                        email: addCartUser.email,
                        role: addCartUser.role,
                        cart: []
                    }
                );
                return done(null,user);
            }
            user = new DtoUserGithubFront(
                {
                    name: name,
                    id: user._id,
                    email: user.email,
                    role: user.role,
                    cart: []
                }
            );
            return done(null,user);
        }catch(error){
            return done(error)
        }
    }))


    passport.serializeUser(function(user,done){
        return done(null,user.id);
    });
    passport.deserializeUser(async function(id,done){
        const user = await UserService.getUserBy({_id: id});
        return done(null,user);
    });
}

export default initializePassport;