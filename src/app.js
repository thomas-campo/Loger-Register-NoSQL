import  express from "express";
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js"
import __dirname from './utils.js';

const app = express();
const server = app.listen(8080, () => {
    console.log('corriendo  servidor')
})
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`))

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use((req,res,next)=>{//aca es para referenciar nuestro io/mid
    req.io = io;
    req.estoEsUnaVariable = "variable";
    next();
})

app.use('/',viewsRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartRouter);

io.on('connection',socket=>{
    console.log("Nuevo cliente conectado");
    socket.on("product",data=>{
        console.log(data)
    })
})