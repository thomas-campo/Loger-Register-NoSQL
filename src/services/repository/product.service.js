export default class ProductRepository {
    constructor(dao){
        this.dao = dao;
    }
    categories = () => {
        return this.dao.categories();
    }
    getProductArray = (filter, options) => {
        return this.dao.getProductArray(filter, options);
    }
    getProducts = () => {
        return this.dao.getProducts();
    }
    getProductBy = (param) => {
        return this.dao.getProductBy(param);
    }
    getProductById = (id) => {
        return this.dao.getProductById(id);
    }
    createProduct = (product) => {
        return this.dao.createProduct(product)
    }
    updateProduct = (id,product) => {
        return this.dao.updateProduct(id,product);
    }
    deleteProduct = (id) => {
        return this.dao.deleteProduct(id);
    }
}