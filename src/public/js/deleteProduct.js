const listProducts = document.getElementById("listProducts");
const userId = document.querySelector(".uid").id;
const userMail = document.querySelector(".email").id;
const card = document.getElementsByClassName("card");

listProducts.addEventListener('click', (e) => {
    buttonDelete(e)
})
const buttonDelete = async(e) => {
    if(e.target.classList.contains('buttonDeleteProduct')){
        deleteProduct(e.target.parentElement)
    }
    e.stopPropagation();
}

const deleteProduct = async(obj) =>{
    const productId = obj.querySelector(".buttonDeleteProduct").id

    const response = await fetch(`/api/products/${productId}`,{
        method: "GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    const responseData = await response.json();

    if(userMail!==responseData.product.owner){
        swal.fire("No podes eliminar productos que no creaste vos")
    }else{
        const response = await fetch(`api/products/${productId}`,{
            method:'DELETE',
            headers:{
                "Content-Type":"application/json"
            }
          })
        await response.json();
        swal.fire("Se elimino el producto")
        setTimeout(()=>window.location.replace('/products'),2000);
    }
}