export default class CartService {
    constructor(dao){
        this.dao = dao;
    }
    createCartService = (cart) => {
        return this.dao.createCart(cart)
    }
    getCartsService = () => {
        return this.dao.getCarts();
    }
    getCartByIdService = (cid) => {
        return this.dao.getCartById(cid);
    }
    getCartsByUserService = (uid) => {
        return this.dao.getCartsByUser(uid)
    }
    addProductInCartService = (cid, productBody) => {
        return this.dao.addProductInCart(cid, productBody)
    }
    deleteProductInCartService = (cid, products) => {
        return this.dao.deleteProductToCart(cid, products)
    }
    updateProductsToCartService = (cid, products) => {
        return this.dao.updateProductsToCart(cid, products)
    }
    updateOneProductService = (cid, products) => {
        return this.dao.updateOneProduct(cid, products)
    }
}