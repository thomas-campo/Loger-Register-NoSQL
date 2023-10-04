const cid = document.querySelector(".cid").id;
const listProducts = document.getElementById("listProducts");
const divCart = document.getElementById("divCart");

listProducts.addEventListener('click', (e) => {
    buttonDelete(e)
})

divCart.addEventListener('click', (e) => {
    buttonPurchase(e)
})

const buttonDelete = async(e) => {
    if(e.target.classList.contains('eliminarProduct')){
        deleteProduct(e.target.parentElement)
    }
    e.stopPropagation();
}

const deleteProduct = async(obj) =>{
    const productId = obj.querySelector(".eliminarProduct").id

    const response = await fetch(`/api/carts/${cid}/product/${productId}`,{
        method:'DELETE',
        headers:{
            "Content-Type":"application/json"
        }
    })
    const respuesta= await response.json();
    if(!respuesta.status==="200"||!respuesta.status==="ok") swal.fire("no se puedo eliminar el producto, intente nuevamente mas tarde")
    swal.fire("Se elimino el producto del carrito")
    setTimeout(()=>window.location.reload(),2000);
}

const buttonPurchase = async(e) => {
    if(e.target.classList.contains('finalizarCompra')){
        window.location.replace(`/purchase/${cid}`);
    }
    e.stopPropagation();
}