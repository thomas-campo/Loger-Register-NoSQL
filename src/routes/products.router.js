import { Router } from 'express';
import ProductManagerMongo from '../dao/mongo/manager/ProductManagerMongo.js';

const router = Router();

const productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {
  try{
    const products = await productManager.getProducts();
    const maxProducts = req.query.limit;
    if(maxProducts){
      const limitProduct = products.slice( 0 , maxProducts);
      req.io.emit('products',limitProduct);
      res.send({ status: 'success', payload: limitProduct });
    }
    
    req.io.emit('products',products);
    res.send({ status: 'success', payload: products });
  }catch(error){
    console.log("error en el routerGet de productos");
    res.send({error:"error en el servidor al obtenes los productos(router.get(products))"});
  }
});

router.post('/', async (req, res) => {
  try{
    const { title, description, price, category, thumbnail, code, stock } = req.body;
    const products = await productManager.getProducts();
    const productExist = req.body;
    if(!title||!description||!price||!category||!thumbnail||!code) return res.status(400).send({status:"error",error:"Valores incompletos",title,description,price,category,thumbnail,code})
    const exist = products.find( p => p.code === productExist.code)
    if(exist){
      console.log('el producto ya existe')
      return res.send({status:"error",error:"producto ya existente"});
    }
    const product = {
      title,
      description,
      price,
      category,
      thumbnail,
      code,
      stock
    }
    const result = await productManager.createProduct(product);
    const arrayProducts = await productManager.getProducts();
    req.io.emit('products',arrayProducts);
    res.status(201).send({status:"success",payload:result});  
  }catch(error){
    res.status(500).send({error:"error interno del servidor"})
  }
});

router.get('/:pid', async (req, res) => {
  try{
    const { pid } = req.params;
    const product = await productManager.getProductBy({ _id: pid });
    if (!product) return res.status(404).send({ status: 'error', error: 'Company not found' });
    res.send({ product });
  }catch{
    res.status(500).send({error:"error interno del servidor"})
  }
});

router.put('/:pid', async(req,res)=>{
  try{
    const {pid} = req.params;
    const updateProduct = req.body;
    await productManager.updateProduct(pid,updateProduct);
    const arrayProducts = await productManager.getProducts();
    req.io.emit('products',arrayProducts);
    res.sendStatus(201);
  }catch{
    res.status(500).send({error:"error interno del servidor"})
  }
})

router.delete('/:pid',async(req,res)=>{
  try{
    const {pid} = req.params;
    await productManager.deleteProduct(pid);
    const arrayProducts = await productManager.getProducts();
    req.io.emit('products',arrayProducts);
    res.send({status:'success', payload:arrayProducts});
  }catch(error){
    res.status(500).send({error:"error interno del servidor"})
  }
})
export default router;