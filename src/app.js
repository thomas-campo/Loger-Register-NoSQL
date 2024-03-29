import  express from "express";
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import config from './config/config.js';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import viewsRouterMongo from "./routes/views.router.js";

import productsRouterMongo from "./routes/products.router.js"

import cartRouterMongo from "./routes/cart.router.js"

import sessionsRouter from "./routes/sessions.router.js"
import userRouter from "./routes/users.router.js"

import initializePassport from "./config/passport.config.js";

import __dirname from './utils.js';

const app = express();
const PORT = config.app.PORT
const server = app.listen(PORT,()=>console.log(`escuchando en el puerto ${PORT}`));
const io = new Server(server);
const connection =  mongoose.connect(config.mongo.URL);

const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info:{
            title:"Proyecto final",
            description:"Documentacion para el Proyecto final"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(session({
    store: new MongoStore({
        mongoUrl:config.mongo.URL,
        ttl:5000
    }),
    secret:"CoderS3cr3t",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
initializePassport();

app.use('/',viewsRouterMongo);
app.use('/api/products',productsRouterMongo);
app.use('/api/carts',cartRouterMongo);
app.use('/api/sessions',sessionsRouter);
app.use('/api/users',userRouter)

// io.on('connection',async socket=>{
//     const arrayProducts =  await productManager.getProducts();
//     io.emit('products',arrayProducts);
//     console.log("Nuevo cliente conectado");
//     socket.on("product",data=>{
//         console.log(data,"aca esta la data");
//     })
// })