import { Router } from "express";
import ProductManager from "../dao/mongo/manager/ProductManagerMongo.js";
import CartManager from "../dao/mongo/manager/CartManagerMongo.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get('/', async (req,res)=>{//render de home.handlebars
    try{
        const products = await productManager.getProducts()
        res.render('home', { products })
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/products', async (req, res) => {
    try {
        return res.render('products');
    } catch (error) {
        console.log(error);
    }
})

router.get('/cart/:cid',async (req,res)=>{
    try {
        const { cid } = req.params
        const result = await cartManager.getCartById(cid)
        
        if(!result) return res.render('cart', { result: false, message: 'no se econtro el carrito '});

        const data = await cartManager.getCartById(cid);
        console.log(data);
        return res.render('cart', {data});

    } catch (err) {
        console.log(err);
    }
})


export default router;