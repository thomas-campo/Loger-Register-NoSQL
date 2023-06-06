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
        if(!req.session.user) return res.redirect('/login');
        return res.render('products',{
            user:req.session.user
        });
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
});

router.get('/register',(req,res)=>{
    res.render('register');
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/profile',async(req,res)=>{
    res.render('profile',{
        user:req.session.user
    })
})

export default router;