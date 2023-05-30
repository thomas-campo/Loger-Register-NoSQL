import { Router } from 'express';
import ProductManagerMongo from '../dao/mongo/manager/ProductManagerMongo.js';

const router = Router();

const productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {
  
  const products = await productManager.getProducts();
  const maxProducts = req.query.limit;
  if(!maxProducts){
    req.io.emit('products',products);
    res.send({ status: 'success', payload: products });
  }
  const limitProduct = products.slice( 0 , maxProducts);
  req.io.emit('products',limitProduct);
  res.send({ status: 'success', payload: limitProduct });
});

router.post('/', async (req, res) => {
  const { title, description, price, category, thumbnail, code, stock } = req.body;
  const products = await productManager.getProducts();
  const productExist = req.body;
  if(!title||!description||!price||!category||!thumbnail||!code) return res.status(400).send({status:"error",error:"Valores incompletos"})
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

  await productManager.createProduct(product);
  res.sendStatus(201);
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const product = await productManager.getProductBy({ _id: cid });
  if (!product) return res.status(404).send({ status: 'error', error: 'Company not found' });
  res.send({ product });
});

router.put('/:cid', async(req,res)=>{
  const {cid} = req.params;
  const updateProduct = req.body;
  await productManager.updateProduct(cid,updateProduct);
  res.sendStatus(201);
})

router.delete('/:cid',async(req,res)=>{
  const {cid} = req.params;
  await productManager.deleteProduct(cid);
  res.send({status:'success', payload:productManager.getProducts()});
})

export default router;