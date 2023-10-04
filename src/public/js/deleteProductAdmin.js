const listProducts = document.getElementById("listProducts");
const userId = document.querySelector(".uid").id;
const card = document.getElementsByClassName("card");

listProducts.addEventListener('click', (e) => {
    buttonDelete(e)
})
const buttonDelete = async(e) => {
    if(e.target.classList.contains('buttonDeleteProduct')){
        const obj = e.target.parentElement;
        let productId = obj.querySelector(".buttonDeleteProduct").id;
        Swal.fire({
            title: `Quieres eliminar este producto: ${productId}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(e.target.parentElement)
            }
        })
    }
    e.stopPropagation();
}

const deleteProduct = async(obj) =>{
    const productId = obj.querySelector(".buttonDeleteProduct").id;

    const response = await fetch(`api/products/${productId}`,{
        method:'DELETE',
        headers:{
            "Content-Type":"application/json"
        }
    })
    await response.json();
    swal.fire("Se elimino el producto")
    setTimeout(()=>window.location.reload(),2000);
}