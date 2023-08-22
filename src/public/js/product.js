const listProducts = document.getElementById("listProducts")
const userMail = document.getElementById("userMail").textContent;
const userId = document.getElementById("userId").textContent;
const cartId = document.getElementById("cartId").textContent;

listProducts.addEventListener('click', (e) => {
    addCarrito(e)

})
const addCarrito = async(e) => {
    if(e.target.classList.contains('agregarAlCarrito')){
        addToCart(e.target.parentElement)
    }
    e.stopPropagation();
}

const addToCart = async(obj) =>{
    const productId = obj.querySelector(".agregarAlCarrito").id
    const response = await fetch(`/api/products/${productId}`,{
        method: "GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const responseData = await response.json();

    if(userMail===responseData.product.owner){
        swal.fire("No puedes agregar productos al carrito creados por vos")
    }else{
        const obj = {quantity:1};
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`,{
            method: "POST",
            body:JSON.stringify(obj),
            headers:{
                "Content-Type":"application/json"
            }
        })
        await response.json();
        swal.fire("se agrego el producto al carrito")
    }
}