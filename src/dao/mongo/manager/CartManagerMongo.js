import cartModel from "../models/cart.js";

export default class CartManager{
    createCart= async (cart)=>{
        const {uid, products} = cart;
        const cartCreated = await cartModel.create({user: uid})
        if (products.length > 0){
            products.forEach(product => cartCreated.products.push(product));
        } 
        cartCreated.save()
        return cartCreated
    }

    getCarts=()=>{
        return cartModel.find().lean();
    }

    getCartById=async(cid)=>{//trae los productos del carrito, buscando por el id del carrito
        return await cartModel.findOne({ _id: cid }).lean()
    }

    getCartsByUser = async (uid) => {
        return await cartModel.find({user: uid}).lean();
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

    deleteCart = async (cid) => {
        try {
            return await cartModel.findByIdAndDelete(cid);
        } catch (err) {
            console.log(err);
            return err
        }
    }

    updateProductsToCart = async (cid, products) => {
        try {
            return await cartModel.findOneAndUpdate({ _id: cid },{ products }).lean();
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
