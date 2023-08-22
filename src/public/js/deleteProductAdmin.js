const listProducts = document.getElementById("listProducts");
const userId = document.getElementById("userId").textContent;
const card = document.getElementsByClassName("card");

listProducts.addEventListener('click', (e) => {
    buttonDelete(e)
})
const buttonDelete = async(e) => {
    if(e.target.classList.contains('buttonDeleteProduct')){
        // console.log(e.target.parentElement)
        deleteProduct(e.target.parentElement)
    }
    e.stopPropagation();
}

const deleteProduct = async(obj) =>{
    // console.log(obj,"producto")
    const productId = obj.querySelector(".buttonDeleteProduct").id;

    const response = await fetch(`api/products/${productId}`,{
        method:'DELETE',
        headers:{
            "Content-Type":"application/json"
        }
    })
    await response.json();
    swal.fire("Se elimino el producto")
    window.location.replace('/products');
}