import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";
import { Product } from "../manager/ProductManager.js";

const productManager = new ProductManager();

const router = Router();

const product = await productManager.getProducts();

router.get('/', async (req,res) => {
    try{
        const maxProducts = req.query.limit;
        const products = await product
        if(maxProducts){
            const limitProduct = products.slice( 0 , maxProducts);
            res.send(limitProduct);
        } else{
            res.send(products)
        }
    }catch(err){
        console.error(err)
        res.code(500)
        res.send("hubo un error al buscar los productos")
    }
})

router.get('/:pid', async (req,res) => {
    try{
        const productsId = req.params.pid;
        console.log(productsId)
        const products = await product;
        const search = products.find( u => u.id == productsId);
        res.send(search);
    }catch(err){
        console.error(err)
        res.code(500)
        res.send("producto no encontrado")
    }
})

router.post('/', async (req,res)=>{
    try{
        if(!req.body.title ||
            !req.body.description ||
            !req.body.code ||
            !req.body.price ||
            !req.body.status ||
            !req.body.stock ||
            !req.body.category ||
            !req.body.thumbnails){
                console.error('el producto esta incompleto');
                res.send()
                return
        }

        const title = req.body.title
        const description = req.body.description
        const code = req.body.code
        const price = req.body.price
        const status = req.body.status
        const stock = req.body.stock || 100
        const category = req.body.category
        const thumbnails = req.body.thumbnails
        
        const newProduct = new Product(title, description, price, category, thumbnails, code, stock, status);
        const newProductCreated = await productManager.addProduct(newProduct);

        res.json(newProductCreated)
    } catch (err) {
        res.send("error en crear el  producto")
    }

})

router.put('/:pid', async (req,res) => {
    try{
        const productoId = req.params.pid;

        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const category = req.body.category;
        const thumbnails = req.body.thumbnails;
        const code = req.body.code;
        const stock = req.body.stock;
        const status = req.body.status;

        if (!productoId) return res.send('no enviaste el producto a actualizar');
        
        const product = new Product(title, description, price, category, thumbnails, code, stock, status);
        const updatedProduct = await productManager.updateProduct(productoId, product);
        res.json(updatedProduct);
    }catch(err){
        const productoId = req.params.pid;
        console.log(`error en actualizar el producto ${productoId}`)
        res.send(null)
    }
})

router.delete('/:pid', async (req,res) =>{
    try{
        const productId = req.params.pid;
        const productDelete = await productManager.deleteProduct(productId)
        res.send(productDelete);
        console.log(productDelete)
    }catch(err){
        console.log(err)
    }
})

export default router;