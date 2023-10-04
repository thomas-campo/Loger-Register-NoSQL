const listProducts = document.getElementById("listProducts")
const cid = document.querySelector(".cid").id;
const uid = document.querySelector(".uid").id;
const email = document.querySelector(".email").id;

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

    if(email===responseData.product.owner){
        swal.fire("No puedes agregar productos al carrito creados por vos")
    }else{
        const obj = {quantity:1};
        await fetch(`/api/carts/${cid}/product/${productId}`,{
            method: "POST",
            body:JSON.stringify(obj),
            headers:{
                "Content-Type":"application/json"
            }
        })
        swal.fire("se agrego el producto al carrito")
    }
}