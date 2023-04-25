import fs from 'fs'

class CartManager {
    constructor(carts = []) {
        this.carts = carts;
        this.path = "./cart.json";
        this.last_id = 1;
    }

    // Init file
    initialize = async () => {
        const cartsJson = JSON.stringify(this.carts)
        await fs.promises.writeFile(this.path, cartsJson)
    };

    createCart = async (newCart) => {
        try {
            
            if (!newCart.products) {
                throw new Error('Incomplete cart data')
            }

            
            newCart.id = this.last_id

            this.last_id = this.last_id + 1
            this.carts.push(newCart)


            const dataJson = JSON.stringify(this.carts)
            const data = await fs.promises.writeFile(this.path, dataJson)

            return newCart
        } catch (error) {
            console.log(error)
        }
    }

    getProductByCartId = async (cid) => {
        try {
            const myCart = this.carts.find(c => c.id === cid);
            if (!myCart) return console.log("Error, carrito no encontrado");
            return myCart
        } catch (err) {
            console.log(err)
        }
    }

    addProductToCart = async (cid, pid, quantity = 1) => {
        const item_index = this.carts.findIndex(c => c.id === cid)

        if (item_index < 0) {
            console.info(`no cart with the next id: ${cid}`)
            return null
        }

        const selectedCart = this.carts[item_index];
        const productIndex = selectedCart.products.findIndex(p => p.pid === pid)

        if (productIndex >= 0) {
            this.carts[item_index][productIndex].quantity += 1
        } else {
            const cartProduct = { quantity, pid }
            selectedCart.products.push(cartProduct);
        }

        const cartJson = JSON.stringify(this.carts)
        await fs.promises.writeFile(this.path, cartJson);

        return this.carts[item_index]
    }
}

export default CartManager;