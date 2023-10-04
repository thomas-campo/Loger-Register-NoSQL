import { v4 as uuid } from "uuid"

import { CartService, ProductService, TicketsService, UserService } from "../services/service.js";

const getCart = async(req, res) => {//buscar el carrito por id
    try{//listo
     const cid  = req.params.cid;
     const mycart = await CartService.getCartById(cid);
     if(!mycart) return res.status(404).send("carrito no encontrado");
     return res.send(mycart)
    }catch(err){
        console.log(err)
        res.status(500).send({error:"Error interno del servidor"});
    }
}

const createCart = async(req, res) => {//crear carrito
    try{//listo
        const { uid } = req.body

        let existsCart = await CartService.getCartsByUser(uid)

        async function handleCart() {
            try{
                let newUserCart;
                if (existsCart.length === 0) {
                    existsCart = await CartService.createCart({ uid, products: [] });
                    await UserService.updateCartInUser( uid, existsCart._id)
                }
                return newUserCart;
            }catch(err){
                console.log(err)
            }
        }
                
        let cart = existsCart[0] ? existsCart[0]._id : await handleCart();

        res.status(200).send(cart);
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
        
        const productId = await ProductService.getProductById(pid);
        

        if (!productId) return res.status(404).send({error:`no se encontro el producto con ese id:${pid}`})
    
        const cartId = await CartService.getCartById(cid)

        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con ese id:${cid}`})
    
        const result = await CartService.addProductInCart(cid, { _id: pid, quantity })
        
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

        const cartId = await CartService.getCartById(cid)
        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con ese id:${cid}`})
        
        await CartService.updateProductsToCart(cid, products);
        return res.status(200).send({message:'productos actualizados con exito en el carrito'});
    }catch(error) {
        console.log(error);
    }

}

const putQuantity = async (req, res) => {//actualiza la cantidad que tiene un producto
    try {//listo
        let { cid, pid } = req.params
        const { quantity } = req.body
            
        const productId = await ProductService.getProductById(pid);
        
        if (!productId) return res.status(404).send({error:`no se encontro el producto con este id:${pid}`})
        
        const cartId = await CartService.getCartById(cid)

        if (!cartId) return res.status(404).send({error:`no se encontro el carrito con este id: ${cid}`})
    
        const result = cartId.products.findIndex(product => product._id._id.toString() === pid)

        if (result === -1) return res.status(404).send({ status: 'error', payload: null, message: `el producto con el id ${pid} no se puede actualizar porque no se encuentra` })
        
        if (quantity < 1) return res.status(400).send({error:'la cantidad no puede ser menor que 1'})

        cartId.products[result].quantity = quantity

        const cart = await CartService.updateOneProduct(cid, cartId.products)

        return res.status(200).send({message:`el producto se actualizo correctamente`,cart});
        
    } catch (error) {
        console.log(error);
    }
}

const deleteProductInCart = async (req, res) =>{//elimina un producto del carrito
    try {//listo
        const { cid, pid } = req.params

        const cartId = await CartService.getCartById(cid);
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito con este id:${cid}`})
        
        const productId = await ProductService.getProductById(pid);
        if (!productId) return res.status(404).send({error: `no se encontro el producto con este id:${pid}`})

        const findProduct = cartId.products.findIndex((p) => p._id._id.toString() === pid);

        if(findProduct === -1) return res.status(404).send({error: `no se encontro el producto con este id:${pid}`})
        
        cartId.products.splice(findProduct, 1)
        
        const cart = await CartService.deleteProductToCart(cid, cartId.products)    
    
        return res.status(200).send({message:`producto eliminado`})
    } catch (error) {
        console.log(error);
    }
}

const deleteCart = async (req, res) => {//elimina todos los productos del carrito
    try {//listo
        const {cid} = req.params;
        const cartId = await CartService.getCartById(cid);
        
        if (!cartId) return res.status(404).send({error: `no se encontro el carrito`});

        cartId.products = [];
        
        const cart = await CartService.updateOneProduct(cid, cartId.products);
        return res.status(200).send(`productos eliminados correctamente `);
        
    } catch (error) {
        console.log(error);
    }
}

const purchaseCart = async (req,res) =>{
    try {
        const cid = req.params.cid

        const cart = await CartService.getCartById(cid)

        if(!cart) return res.send(404).send({message:"no se encontro el carrito"});

        const uid = cart.user.toString()

        const user = await UserService.getUserById(uid);

        if(!user) return res.send(404).send({message:"no se encontro el usuario"});

        let priceTotal = 0;
        let amount = 0;
        let productPurchase = [];
        let productsOutStock = [];

        for (let product of cart.products) {
            if (product._id.stock <= product.quantity) {
                productsOutStock.push(product);
            } else {
                amount = amount + product.quantity;
                priceTotal = priceTotal + product._id.price;
                product._id.stock -= product.quantity;
                await ProductService.updateProduct(product._id._id, product._id)
                productPurchase.push(product);
            }
        }

        const ticket = {
            code: uuid(), 
            cart: cid,
            amount: amount,
            price: priceTotal,
            purchaser: user.email
        }

        if (!amount) return res.status(403).send({ message: 'productos no encontrados' });
        if (!priceTotal) return res.status(403).send({ message: 'productos no encontrados' });

        const newTicket = await TicketsService.createTicket(ticket)
        const cartUpdate = await CartService.updateProductsToCart(cid, productsOutStock);
        if(!cartUpdate) return res.status(505).send({error:"no se puedo actualizar el carrito con los productos sin stock"})

        return res.send({payload:newTicket});
    } catch (error) {
        console.log("error del purchase")
        return res.send(error)
    }
}

export default {
    getCart,
    createCart,
    addProductInCart,
    putCart,
    putQuantity,
    deleteProductInCart,
    deleteCart,
    purchaseCart
}