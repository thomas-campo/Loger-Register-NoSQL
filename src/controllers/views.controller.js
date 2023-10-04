import  jwt  from "jsonwebtoken";
import { CartService, ProductService, UserService } from "../services/service.js"

import ProdModel from '../dao/mongo/models/product.js';
import config from "../config/config.js";

const getHome =  async (req,res)=>{
    try{
        const { page = 1 } = req.query;
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await ProdModel.paginate({}, { page, limit: 10, lean: true })
        const products = docs;
        res.render("home", { allProducts: products, page: rest.page, hasPrevPage, hasNextPage, prevPage, nextPage });
    }catch(err){
        res.status(500).send(err)
    }
}

const getProducts = async (req, res) => {
    try {
        if(!req.session.user) return res.redirect('/login');
        const userData = req.session.user;
        const { page = 1 } = req.query;
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await ProdModel.paginate({}, { page, limit: 10, lean: true })
        const products = docs;
        if(userData.role==="user"){
            const cart = await CartService.getCartsByUser(userData.id);
            const cartId = cart[0]._id;
            const rolUser = true;
            return res.render("products", { allProducts: products, page: rest.page, hasPrevPage, hasNextPage, prevPage, nextPage, user: userData, rolUser, cartId });
        }
        if(userData.role==="premium"){
            const cart = await CartService.getCartsByUser(userData.id);
            const cartId = cart[0]._id;
            const rolPremium = true;
            return res.render("products", { allProducts: products, page: rest.page, hasPrevPage, hasNextPage, prevPage, nextPage, user: userData, rolPremium, cartId });
        }
        if(userData.role==="admin"){
            const rolAdmin = true;
            return res.render("panelAdmin", { allProducts: products, page: rest.page, hasPrevPage, hasNextPage, prevPage, nextPage, user: userData, rolAdmin});
        }
        res.render("noAuth");
    } catch (error) {
        console.log(error);
    }
}

const getUsers = async (req,res) => {
    try {
        if(!req.session.user) return res.redirect('/login');

        const user = req.session.user;
        if(!user) return res.render("noAuth");

        if(user.role!=="admin") return res.render("noAuth");

        const users = await UserService.getUsers();

        res.render("users",{ users, user });
    } catch (error) {
        res.status(500).send({error:error});
    }
}

const getCartById = async (req,res)=>{
    try {
        if(!req.session.user) return res.redirect('/login');

        const user = req.session.user;
        const { cid } = req.params
        const result = await CartService.getCartById(cid)

        if(!result) return res.render('cart', { result: false, message: 'no se econtro el carrito '});
        
        if(result.user.toString() !== user.id) return res.status(401).send({message:"este carrito no es tuyo"})

        const data = await CartService.getCartById(cid);
        return res.render('cart', {data});

    } catch (err) {
        console.log(err);
    }
}

const getRegister = (req,res)=>{
    res.render('register');
}

const getLogin = (req,res)=>{
    res.render('login');
}

const getProfile = async(req,res)=>{
    res.render('profile',{
        user:req.session.user
    })
}

const getRestoreRequest = (req,res)=>{
    res.render('restoreRequest')
}

const getRestorePassword = (req,res)=>{
    const {token} = req.query;
    try{
        const validToken = jwt.verify(token,config.jwt.SECRET);
        if(!validToken) return res.render("invalidToken");
        res.render('restorePassword');
    }catch(error){
        return res.render('InvalidToken');
    }
}

const getCreateProduct = (req,res)=>{
    if(!req.session.user) return res.redirect('/login');
    const user = req.session.user;
    if(user.role==="premium"){
        const rolPremium = true;
        return res.render('createProduct',{ user, rolPremium });
    }
    if(user.role==="admin"){
        const rolAdmin = true;
        return res.render('createProduct',{ user, rolAdmin });
    }
    res.render("noAuth");
}

const getUpdateProduct = (req,res)=>{
    if(!req.session.user) return res.redirect('/login');
    const user = req.session.user;
    if(user.role==="admin"){
        return res.render('updateProduct', user);
    }
    res.render('noAuth');
}

const getDeleteProduct = async(req,res) =>{
    try {
        if(!req.session.user) return res.redirect('/login');
        const userData = req.session.user;
        const { page = 1 } = req.query;
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await ProdModel.paginate({}, { page, limit: 10, lean: true })
        const products = docs;
        if(userData.role==="premium"){
            const rolPremium = true;
            return res.render("deleteProduct", { allProducts: products, page, hasPrevPage, hasNextPage, prevPage, nextPage, user: userData, rolPremium });
        }
        if(userData.role==="admin"){
            const rolAdmin = true;
            return res.render("deleteProduct", { allProducts: products, page, hasPrevPage, hasNextPage, prevPage, nextPage, user: userData, rolAdmin });
        }
        res.render("noAuth");
    } catch (error) {
        console.log(error);
        res.send({status:505,error:"Error viewDeleteProduct"})
    }
}

const getPuncharse = async(req,res)=>{
    if(!req.session.user) return res.redirect('/login');

    const { cid } = req.params;
    const cart = await CartService.getCartById(cid);

    if(!cart) return res.render("no se encontro un carrito con ese usuario");

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
    
    res.render("purchase",{ productPurchase, productsOutStock , priceTotal , amount, cid })
}

export default {
    getHome,
    getProducts,
    getUsers,
    getCartById,
    getRegister,
    getLogin,
    getProfile,
    getRestoreRequest,
    getRestorePassword,
    getCreateProduct,
    getUpdateProduct,
    getDeleteProduct,
    getPuncharse
}
