import mongoose from "mongoose";
import cartModel from "../models/cart.js";

import ProductManager from "./ProductManagerMongo.js";

const productManager = new ProductManager();

export default class CartManager{
    createCart=(product)=>{
        const cartCreated = cartModel.create({});
        products.forEach(product => cartCreated.products.push(product));
        cartCreated.save()
        return cartCreated
    }

    getCarts=()=>{
        return cartModel.find().lean();
    }

    getCartById=(cid)=>{//trae los productos del carrito, buscando por el id del carrito
        return cartModel.findById(cid).lean();
    }
    
    addProductToCart=(cid,pid)=>{//agrega productos al carrito se
        try {
            return cartModel.updateOne({_id:cid}, {$push: {products:{product: new mongoose.Types.ObjectId(pid)}}})
        }catch(error){
            res.send(`hubo un error al agregar el producto al carrito`);
        }
    }
    
    deleteProductByIdCart=(cid,pid)=>{//busca primero el carrito y despues el producto y lo elimina
        const carrito = cartModel.this.getCartById(cid);
        return cartModel.carrito.findByIdAndDelete(pid);
    }

    deleteProductToCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid },
                { products })
        } catch (err) {
            console.log(err.message);
            return err
        }

    }

    updateProductsToCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate({ _id: cid },{ products })
        } catch (err) {
            return err
        }
    }

    updateOneProduct = async (cid, products) => {
        await cartModel.updateOne({ _id: cid },{products})
        return await cartModel.findOne({ _id: cid })
    }

}