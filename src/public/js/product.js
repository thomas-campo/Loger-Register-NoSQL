// import ProductManager from "../../dao/mongo/manager/ProductManagerMongo.js";
// import CartManager from "../../dao/mongo/manager/CartManagerMongo.js";

// const cartManager = new CartManager();
// const productManager = new ProductManager();

// export default function(socketServer) {
//     socketServer.on('connection', async socket => {
//         socket.on('agregar',async data =>{
//             console.log("hola")
//             const pid = data;
//             const cid = "64751796ba779febe906b108";
//             const quantity = 1;
        
//             console.log(pid,"pid");
//             const productId = await productManager.getProductById(pid);
            
//             if (!productId) return console.log("error al buscar el producto");
        
//             const cartId = await cartManager.getCartById(cid);
    
//             if (!cartId) return console.log("error al buscar el carrito");
//             const result = await cartManager.addProductInCart(cid, { _id: pid, quantity });
//             console.log(result,"resultado agregar al carrito");
//         });
    
//         socket.on('delete', async data => {
//             await cartManager.deleteProductToCart(data);
//             const products = await productManager.getProducts();
//             socket.emit('products', { products });  
//         })
//     })

// }
const listProducts = document.getElementById("listProducts")
let cart = {};

listProducts.addEventListener('click', (e)=>{
    addCarrito(e)
})
const addCarrito = (e) => {
    if(e.target.classList.contains('agregarAlCarrito')){
        setCart(e.target.parentElement)
    }
}

const setCart = obj =>{
    const product = {
        id:obj.querySelector(".agregarAlCarrito").id,
        title:obj.querySelector("h2").textContent,
        price:obj.querySelector(".price").textContent,
        quantity:1
    }
    if(cart.hasOwnProperty(product.id)){
        product.quantity = cart[product.id].quantity + 1
    }
    cart[product.id] = {...product}
    console.log(cart)
}


// function addToCarritoItem(e){
//     const button = e.target
//     const item = button.closest(`.card`)
//     const itemTitle = item.querySelector(`.card-title`).textContent
//     const itemPrice = item.querySelector(`.precio`).textContent
//     const newItem = {
//         title:itemTitle,
//         precio: itemPrice,
//         cantidad: 1
//     }
//     console.log(newItem);
// }