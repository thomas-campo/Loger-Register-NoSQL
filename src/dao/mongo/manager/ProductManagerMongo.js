import productModel from "../models/product.js"

export default class ProductManager{
    getProducts=()=>{
        return productModel.find().lean();
    }

    getProductBy=(param)=>{
        return productModel.findOne(param).lean();
    }

    getProductById=(id)=>{
        console.log(id,"idproduct")
        return productModel.findById(id).lean();
    }

    createProduct=(product)=>{
        console.log(product);
        return productModel.create(product);
    }

    updateProduct=(id,product)=>{
        return productModel.findByIdAndUpdate(id,{$set:product});
    }

    deleteProduct=(id)=>{
        return productModel.findByIdAndDelete(id);
    }
}