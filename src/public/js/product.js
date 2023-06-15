import ProductManager from "../../dao/mongo/manager/ProductManagerMongo.js";
import CartManager from "../../dao/mongo/manager/CartManagerMongo.js";

const cartManager = new CartManager();
const productManager = new ProductManager();

export default function(socketServer) {
    socketServer.on('connection', async socket => {
        socket.on('agregar',async data =>{
            const pid = data;
            const cid = "64751796ba779febe906b108";
            const quantity = 1;
        
            console.log(pid,"pid");
            const productId = await productManager.getProductById(pid);
            
            if (!productId) return console.log("error al buscar el producto");
        
            const cartId = await cartManager.getCartById(cid);
    
            if (!cartId) return console.log("error al buscar el carrito");
            const result = await cartManager.addProductInCart(cid, { _id: pid, quantity });
            console.log(result,"resultado agregar al carrito");
        });
    
        socket.on('delete', async data => {
            await cartManager.deleteProductToCart(data);
            const products = await productManager.getProducts();
            socket.emit('products', { products });  
        })
    })

}