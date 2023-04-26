import ProductManager from "./src/manager/ProductManager.js";
import CartManager from "./src/manager/CartManager.js";

const productManager = new ProductManager();
const cartManager = new CartManager();

const context = async() =>{
    //const test  = await productManager.getProducts();
    
    let productoDePrueba = {
        title:"teclado",
        description:"dispisitivo para escribir",
        price: 150,
        category: "accesorio",
        thumbnail:"url",
        code: 158,
        stock: 100,
        status:true
    }

    let productoDePrueba2 = {
        title:"joystick",
        description:"un control romoto para jugar",
        price: 300,
        category: "accesorio",
        thumbnail:"url",
        code: 12,
        stock: 100,
        status:true
    }
    
    let productoDePrueba3 = {
        title:"mouse",
        description:"dispositivo para navergar por el pc",
        price: 350,
        category: "accesorio",
        thumbnail:"url",
        code: 12,
        stock: 100,
        status:true
    }

    await cartManager.getProductByCartId(2);

    //await productManager.addProduct(productoDePrueba);
    //await productManager.addProduct(productoDePrueba2);
    //await productManager.addProduct(productoDePrueba3);
    
    //await productManager.getProductById(3)//listo
    //await productManager.getProducts()
    //await productManager.updateProduct(1,{
    //     title:"joystick",
    //     code: 1200000,
    //     stock: 12345
    // });
    //await productManager.deleteProduct(4);//listo
    //console.log(test)
}

context();