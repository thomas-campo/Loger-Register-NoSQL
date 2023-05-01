import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const productManager = new ProductManager();


router.get('/', async (req,res)=>{//render de home.handlebars
    try{
        const products = await productManager.getProducts()
        res.render('home', { products })
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/realTimeProducts',(req,res)=>{//aca conecto la vista realtimeproducts con el render
    res.render('realTimeProducts', {} )
})


export default router;