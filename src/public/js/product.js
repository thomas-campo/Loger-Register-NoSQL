const listProducts = document.getElementById("listProducts")

// listProducts.addEventListener('click', e => {
//     // addCarrito(e)
//     addToCarritoItem(e)
// })
// const addCarrito = (e) => {
//     if(e.target.classList.contains('agregarAlCarrito')){
//         console.log(e.target.parentElement)
//         // setCart(e.target.parentElement)
//     }
// }

// const setCart = obj =>{
//     const product = {
//         id:obj.querySelector(".agregarAlCarrito").id,
//         title:obj.querySelector("h2").textContent,
//         quantity:1
//     }
//     cart[product.id] = {...product}
//     console.log(cart)
// }


// const addToCarritoItem = (e) => {
//     if(e.target.classList.contains('agregarAlCarrito')){
//                 console.log(e.target.parentElement)
//                 // setCart(e.target.parentElement)
//     }
//     const button = e.target.parentElement
//     console.log(e.target.parentElement)
//     console.log(item,"item")
//     console.log(button,"boton")
//     const item = button.closest(`.card`)
//     const itemTitle = item.querySelector(`.card-title`).textContent
//     const itemPrice = item.querySelector(`.precio`).textContent
//     const newItem = {
//         title:itemTitle,
//         precio: itemPrice,
//         cantidad: 1
//     }
//     console.log(newItem);
// }