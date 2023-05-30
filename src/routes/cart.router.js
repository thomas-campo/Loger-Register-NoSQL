import { Router } from 'express'
import CartManager from '../dao/mongo/manager/CartManagerMongo.js';
import ProductManager from '../dao/mongo/manager/ProductManagerMongo.js';

const routerCart = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

routerCart.get('/:cid', async(req, res) => {//buscar el carrito por id
   try{
    const cid  = req.params.cid;
    const mycart = await cartManager.getCartById(cid);
    if(!mycart) return res.status(404).send("carrito no encontrado");
    return res.send(mycart)
   }catch(err){
        console.log(err)
        res.status(500).send({error:"Error interno del servidor"});
   }
})

routerCart.post('/', async(req, res) => {//crear carrito
    try{
        const createdCart = await cartManager.createCart();
        res.send(createdCart);
    }catch(err){
        console.log(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
})

routerCart.post('/:cid/product/:pid', async(req, res) => {//agregar un producto al carrito
    try{
        const cid = req.params.cid;
        const pid= req.params.pid;
      const cart = await  cartManager.addProductToCart(cid, pid);
      res.send({status: 'success', payload:cart })
      
    }catch(err){
        console.log(err)
        res.send({error:`error:${err}`});
    }
})


routerCart.put('/:cid', async (req, res) =>{//actualiza el carrito con un arreglo de productos
    
    try {
        const { cid } = req.params;
        const {products} = req.body;

        const results = await products.map(async (product) => {
            const checkId = await productManager.getProductById(product._id);
            if (!checkId) {
                return res.send({error: `no se encontro los productos del carrito`});
            }
        });
        const check = results.find(value => value !== undefined);
        if (check) return res.status(404).send("check");

    
        const cartId = await cartManager.getCartById(cid);
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito`});

        const cart = await cartManager.updateProductsToCart(cid, products);
        return res.status(200).send({status:'success', payload:cart});
    } catch (error) {
        console.log(error);
    }

})

routerCart.put('/:cid/product/:pid', async (req, res) => {//actualiza la cantidad que tiene un producto

    try {
        const { cid, pid } = req.params
        const { quantity } = req.body
        
        // const productId = await productManager.getProductById(pid);
        // if (!productId) return res.status(404).send({error: `no se encontro el producto`});
        const cartId = await cartManager.getCartById(cid);
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito`});
        
        const result = cartId.products.findIndex(product => product._id.toString() === pid);
        
        cartId.products[result].quantity = quantity;
        
        await cartManager.updateOneProduct(cid, cartId.products);
        
    } catch (error) {
        console.log(error);
    }
})

routerCart.delete('/:cid/product/:pid', async (req, res) =>{//elimina un producto del carrito
    try {//listo pero lo elimina por el "_id" del product, no por el "id" del product
        const { cid, pid } = req.params

        console.log(pid)
        
        const cartId = await cartManager.getCartById(cid);
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito con este id:${cid}`})
        
        const productId = await productManager.getProductById(pid);
        if (!productId) return res.status(404).send({error: `(productid)no se encontro el producto con este id:${pid}`})
    
        const findProduct = cartId.products.findIndex((product) => product._id._id.toString() === pid);
    
        if(findProduct === -1) return res.status(404).send({error: `(filtro)no se encontro el producto con este id:${pid}`})
        
        cartId.products.splice(findProduct, 1)
        
        const cart = await cartManager.deleteProductToCart(cid, cartId.products)    
    
        return res.status(200).send({status:'success', message:`producto eliminado`, cart })
    } catch (error) {
        console.log(error);
    }
})

routerCart.delete('/:cid', async (req, res) => {//elimina todos los productos del carrito
    try {//listo
        const {cid} = req.params;
        const cartId = await cartManager.getCartById(cid);
        
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito`});

        cartId.products = [];
        
        const cart = await cartManager.updateOneProduct(cid, cartId.products);
        return res.status(200).send(`productos eliminados correctamente `);
        
    } catch (error) {
        console.log(error);
    }
})

export default routerCart;