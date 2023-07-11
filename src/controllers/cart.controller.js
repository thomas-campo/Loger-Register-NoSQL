import CartManager from '../dao/mongo/manager/CartManagerMongo.js';
import ProductManager from '../dao/mongo/manager/ProductManagerMongo.js';
import cartModel from '../dao/mongo/models/cart.js';
const productManager = new ProductManager();
const cartManager = new CartManager();

const searchCart = async(req, res) => {//buscar el carrito por id
    try{//listo
     const cid  = req.params.cid;
     const mycart = await cartManager.getCartById(cid);
     if(!mycart) return res.status(404).send("carrito no encontrado");
     return res.send(mycart)
    }catch(err){
         console.log(err)
         res.status(500).send({error:"Error interno del servidor"});
    }
}

const createCart = async(req, res) => {//crear carrito
    try{//listo
        const createdCart = await cartManager.createCart();
        res.status(200).send(createdCart);
    }catch(err){
        console.log(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
}

const addProductInCart = async(req, res) => {//agregar un producto al carrito
    try{//listo
        const {cid,pid} = req.params;
        const { quantity } = req.body;
        
        if (quantity < 1) return res.status(400).send({status:'error', payload:null, message:'la cantidad no puede ser menor que 1'});
        
        const productId = await productManager.getProductById(pid);
        

        if (!productId) return res.status(404).send({error:`no se encontro el producto con ese id:${pid}`})
    
        const cartId = await cartManager.getCartById(cid)

        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con ese id:${cid}`})
    
        const result = await cartManager.addProductInCart(cid, { _id: pid, quantity })
        
        return res.status(200).send({message:`se agrego correctamente el producto al carrito`, payload:result});
    }catch(err){
        console.log(err)
        res.send({error:`error:${err}`});
    }
}

const putCart = async (req, res) =>{//actualiza el carrito con un arreglo de productos
    try{//listo
        const { cid } = req.params
        const {products} = req.body

        const cartId = await cartManager.getCartById(cid)
        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con ese id:${cid}`})
        
        await cartManager.updateProductsToCart(cid, products);
        return res.status(200).send({message:'productos actualizados con exito en el carrito'});
    }catch(error) {
        console.log(error);
    }

}

const  putQuantity = async (req, res) => {//actualiza la cantidad que tiene un producto
    try {//listo
        let { cid, pid } = req.params
        const { quantity } = req.body
            
        if (quantity < 1) return res.status(400).send({error:'la cantidad no puede ser menor que 1'})
        
        const productId = await productManager.getProductById(pid);

        if (!productId) return res.status(404).send({error:`no se encontro el producto con este id:${pid}`})
    
        const cartId = await cartManager.getCartById(cid)

        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con este id: ${cid}`})
    
        const addProduct = await cartManager.addProductInCart(cid, { _id: pid, quantity })
        
        return res.status(200).send({message:`el producto se agrego correctamente en el carrito`,addProduct});
        
    } catch (error) {
        console.log(error);
    }
}

const deleteProductInCart = async (req, res) =>{//elimina un producto del carrito
    try {//listo
        const { cid, pid } = req.params

        const cartId = await cartManager.getCartById(cid);
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito con este id:${cid}`})
        
        const productId = await productManager.getProductById(pid);
        if (!productId) return res.status(404).send({error: `no se encontro el producto con este id:${pid}`})
        console.log(cartId,"cartId");
        const findProduct = cartId.products.findIndex((p) => p._id._id.toString() === pid);
        console.log("este es el find",findProduct)
        if(findProduct === -1) return res.status(404).send({error: `no se encontro el producto con este id:${pid}`})
        
        cartId.products.splice(findProduct, 1)
        
        const cart = await cartManager.deleteProductToCart(cid, cartId.products)    
    
        return res.status(200).send({message:`producto eliminado`})
    } catch (error) {
        console.log(error);
    }
}

const deleteCart = async (req, res) => {//elimina todos los productos del carrito
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
}

export default {
    searchCart,
    createCart,
    addProductInCart,
    putCart,
    putQuantity,
    deleteProductInCart,
    deleteCart
}