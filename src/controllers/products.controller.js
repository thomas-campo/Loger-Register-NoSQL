import { ProductService } from "../services/service.js";

const getProducts = async (req, res) => {
  try{
    let { limit, page, sort, category } = req.query
      
      const options = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
          sort: { price: Number(sort) }
      };
  
      if (!(options.sort.price === -1 || options.sort.price === 1)) {
          delete options.sort
      }
  
  
      const links = (products) => {
        let prevLink;
          let nextLink;
          if (req.originalUrl.includes('page')) {
              prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          if (!req.originalUrl.includes('?')) {
              prevLink = products.hasPrevPage ? req.originalUrl.concat(`?page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? req.originalUrl.concat(`?page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
          prevLink = products.hasPrevPage ? req.originalUrl.concat(`&page=${products.prevPage}`) : null;
          nextLink = products.hasNextPage ? req.originalUrl.concat(`&page=${products.nextPage}`) : null;
          return { prevLink, nextLink };
  
        }
        
        
    
      const categories = await ProductService.categories()
  
      const result = categories.some(categ => categ === category)
      if (result) {
        const products = await ProductService.getProductArray({ category }, options);
        const { prevLink, nextLink } = links(products);
        const { totalPages, prevPage, page, nextPage, hasNextPage, hasPrevPage, docs } = products
        return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, page, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
      }
  
      const products = await ProductService.getProductArray({}, options);

      const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
      const { prevLink, nextLink } = links(products);
      return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, page, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
    }catch(error){
      res.status(500).send({error:"error en el servidor al obtener los productos(router.get(products))"});
    }
}

const createProduct = async (req, res) => {
    try{
      const { title, description, price, category, thumbnail, code, stock, owner } = req.body;

      const expresiones = {
        title:/^[a-zA-Z ]{2,30}$/,
        category:/^[a-zA-Z ]{2,30}$/,
        stock:/^[0-9]{1,4}$/,
        code:/^[0-9]{3,15}$/,
        price:/^[0-9]{3,8}$/
      }

      if(!expresiones.title.test(title)||!expresiones.stock.test(stock)||!expresiones.price.test(price)||!expresiones.code.test(code)||!expresiones.category.test(category)){
        return res.send({status:"error",error:"Valores incorrectos"})
      }
      
      const products = await ProductService.getProducts();
      const productExist = req.body;

      if(!title||!description||!price||!category||!thumbnail||!code) return res.status(400).send({status:"error",error:"Valores incompletos",message:"Valores incompletos"})
      
      const exist = products.find( p => p.code === productExist.code)
      if(exist){
        return res.send({status:"error",error:"producto ya existente"});
      }
      const product = {
        title,
        description,
        price,
        category,
        thumbnail,
        code,
        stock,
        owner
      }
      const result = await ProductService.createProduct(product);
      res.status(201).send({status:"success",payload:result});  
    }catch(error){
      res.status(500).send({error:"Error interno del servidor en create product"})
    }
}

const getProductById = async (req, res) => {
    try{
      const { pid } = req.params;
      const product = await ProductService.getProductBy({ _id: pid });
      if (!product) return res.status(404).send({ status: 'error', error: 'producto no encontrado' });
      res.send({ product });
    }catch{
      res.status(500).send({error:"error interno del servidor"})
    }
}

const updateProductById = async(req,res)=>{
    try{
      const {pid} = req.params;
      const updateProduct = req.body;
      const { title, price, category, code, stock } = req.body;
      
      const expresiones = {
        title:/^[a-zA-Z ]{2,30}$/,
        category:/^[a-zA-Z ]{2,30}$/,
        stock:/^[0-9]{1,4}$/,
        code:/^[0-9]{3,15}$/,
        price:/^[0-9]{3,8}$/
      }

      if(!expresiones.title.test(title)||!expresiones.stock.test(stock)||!expresiones.price.test(price)||!expresiones.code.test(code)||!expresiones.category.test(category)){
        return res.send({status:"error",error:"Valores incorrectos"})
      }

      await ProductService.updateProduct(pid,updateProduct);
      res.status(200).send({status:"success",message:"el producto se actualizo con exito"});
    }catch(error){
      res.status(500).send({error:"Error interno del servidor"})
    }
}

const deleteProductById = async(req,res)=>{
    try{
      const {pid} = req.params;
      await ProductService.deleteProduct(pid);
      const arrayProducts = await ProductService.getProducts();
      res.send({status:'success', payload:arrayProducts});
    }catch(error){
      res.status(500).send({error:"error interno del servidor"})
    }
}

export default {
    getProducts,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById
}
