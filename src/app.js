import  express from "express";
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";

import ProductManager from "./dao/mongo/manager/ProductManagerMongo.js";

// import viewsRouter from "./routes/views.router.js"
import viewsRouterMongo from "./routes/views.router.js";
// import productsRouter from "./routes/products.router.js";
import productsRouterMongo from "./routes/products.router.js"
// import cartRouter from "./routes/cart.router.js"
import cartRouterMongo from "./routes/cart.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import initializePassport from "./config/passport.config.js";

import __dirname from './utils.js';

const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`escuchando en el puerto ${PORT}`));
const io = new Server(server);
const connection =  mongoose.connect('mongodb+srv://CoderUser:12345@cluster0.eb7exok.mongodb.net/?retryWrites=true&w=majority');

const productManager = new ProductManager();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use(session({
    store: new MongoStore({
        mongoUrl:"mongodb+srv://CoderUser:12345@cluster0.eb7exok.mongodb.net/?retryWrites=true&w=majority",
        ttl:50000
    }),
    secret:"CoderS3cr3t",
    resave:false,
    saveUninitialized:false
}));

app.use((req,res,next)=>{//aca es para referenciar nuestro io/midlewer
    req.io = io;
    next();
})

app.use(passport.initialize());
initializePassport();

app.use('/',viewsRouterMongo);
app.use('/api/products',productsRouterMongo);
app.use('/api/carts',cartRouterMongo);
app.use('/api/sessions',sessionsRouter);

io.on('connection',async socket=>{
    const arrayProducts =  await productManager.getProducts();
    io.emit('products',arrayProducts);
    console.log("Nuevo cliente conectado");
    socket.on("product",data=>{
        console.log(data,"aca esta la data");
    })
})