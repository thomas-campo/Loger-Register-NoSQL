import { Router } from 'express'
import CartManager from '../manager/CartManager.js';

const routerCart = Router();

const cartManager = new CartManager();

routerCart.post('/', async(req, res) => {
    const newCart = { products: [] }
    const createdCart = await cartManager.createCart(newCart)
    console.log(createdCart)
    res.send(createdCart);
})

routerCart.get('/:cid', async(req, res) => {
   const cid  = req.params.cid;
   const mycart = await cartManager.getProductByCartId(cid)
   if(!mycart) return res.send("carrito id no encontrado");
   return res.send(mycart)
})

routerCart.post('/:cid/product/:pid', async(req, res) => {
    const { cid, pid } = req.params;
    if(!pid || !cid) return res.send("Id not provided");

    const updateProduct = await cartManager.addProductToCart(cid,pid);
    return res.send(updateProduct)
})

export default routerCart;