const btnConfirm = document.getElementById("confirmPurchase");
const btnCancel = document.getElementById("cancelPurchase");
const cid = document.querySelector(".cid").id;

btnConfirm.addEventListener("click", async()=>{
    Swal.fire({
        title: 'Quieres confirmar la compra?',
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
            postPurchase();
        }
    })
})

const postPurchase = async() =>{
    const response = await fetch(`/api/carts/${cid}/purchase`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            }
    })
    const payload = await response.json();
    const idTicket = payload.payload._id;
    const priceTicket = payload.payload.price;
    const amountTicket = payload.payload.amount;
    let obj = {};
    obj = payload.payload;
    await fetch('/api/sessions/ticketMail',{
        method: "POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    });
    Swal.fire(`Id del ticket de compra: ${idTicket}, 
    precio total: ${priceTicket}, 
    cantidad total: ${amountTicket}`);
    window.addEventListener("click", ()=>{
        window.location.replace(`/products`);
    })
}

btnCancel.addEventListener("click", ()=>{
    Swal.fire({
        title: 'Quieres cancelar la compra?',
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
            window.location.replace("/products");
        }
    })
})