import ProductManager from "../dao/mongo/manager/ProductManagerMongo.js";
import CartManager from "../dao/mongo/manager/CartManagerMongo.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

const getHome =  async (req,res)=>{//render de home.handlebars
    try{
        if(!req.session.user) return res.redirect('/login');
        const products = await productManager.getProducts()
        res.render('home', { products })
    }catch(err){
        res.status(500).send(err)
    }
}

const getProducts = async (req, res) => {
    try {
        if(!req.session.user) return res.redirect('/login');
        return res.render('products',{
            user:req.session.user
        });
    } catch (error) {
        console.log(error);
    }
}

const getCartById = async (req,res)=>{
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
}

export default {
    getHome,
    getProducts,
    getCartById
}
