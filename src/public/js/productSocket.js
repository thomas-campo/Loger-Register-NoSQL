import ProductManager from "../../manager/ProductManager.js";

const productManager = ProductManager();

export default function productsSockets(ds){
    socketServer.on('connection', async socket =>{
        const data = await productManager.getProducts();
        
        socket.emit('products', { data } )

        socket.on('product', async data =>{
            try{
                const valueReturned = await productManager.addProduct(data);
                socket.emit('message',valueReturned);
            }catch(err){
                console.log(err)
            }
        })
    })
    
    
    
    socket.on('delete', async data =>{
        const result = await productManager.deleteProduct(data);
        socket.emit('message',result);
    })
}
