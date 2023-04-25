import  express from "express";

import productsRouter from "./routes/products.router.js";


const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use('/api/products',productsRouter);
// app.use('/api/carts',);

app.listen(8080, () => {
    console.log('corriendo  servidor')
})
