import mongoose from "mongoose";
import cartModel from "../models/cart.js";

import ProductManager from "./ProductManagerMongo.js";

const productManager = new ProductManager();

export default class CartManager{
    createCart=()=>{
        return cartModel.create({ products: [] });
    }

    getCarts=()=>{
        return cartModel.find().lean();
    }

    getCartById=(cid)=>{//trae los productos del carrito, buscando por el id del carrito
        return cartModel.findOne({ _id: cid }).lean()
    }
    
    addProductInCart = async (cid, productBody) => {
        try {
            const cart = await cartModel.findOne({ _id: cid }).lean();
            const findProduct = cart.products.some(
                (product) => product._id._id.toString() === productBody._id);
            if (findProduct) {
                await cartModel.updateOne(
                    { _id: cid, "products._id": productBody._id },
                    { $inc: { "products.$.quantity": productBody.quantity } })
                    console.log("if")
                return await this.getCartById(cid);
            }

            await cartModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products: {
                            _id: productBody._id,
                            quantity: productBody.quantity
                        }
                    }
                })
                console.log("await")
            return await this.getCartById(cid);
        }
        catch (err) {
            console.log(err.message);
            return err

        }
    }

    deleteProductToCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate({ _id: cid },{ products })
        } catch (err) {
            console.log(err);
            return err
        }

    }

    updateProductsToCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate({ _id: cid },{ products })
        } catch (err) {
            console.log(err.message);
            return err
        }
    }

    updateOneProduct = async (cid, products) => {
        await cartModel.updateOne({ _id: cid },{products})
        return await cartModel.findOne({ _id: cid })
    }
}
