const socket = io();
const products = document.getElementById('products');
const formulario = document.getElementById('form');

const btnEliminar = () => {
    const botones = document.getElementsByClassName('btn-danger')
    const arrayBtn = Array.from(botones)

    arrayBtn.forEach(element => {
        element.addEventListener('click', () => {
            if (result.isConfirmed) {
                socket.emit('delete', Number(element.id))
                socket.on('delete', (event) => {
                    console.log(event);  
                })
            }
        })
    })
}

socket.on('products', data => {

    console.log('mensaje del servidor');

    let productos = ''
    data.forEach(producto => {
        productos +=`<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
                        <div class="card-body">
                            <h4 class="card-title">${producto.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${producto.id}
                                </li>
                                <li>
                                    description: ${producto.description}
                                </li>
                                <li>
                                    price: $${producto.price}
                                </li>
                                <li>
                                    category: ${producto.category}
                                </li>
                                <li>
                                    status: ${producto.status}
                                </li>
                                <li>
                                    stock: ${producto.stock}
                                </li>
                                <li>
                                    thumbnail: ${producto.thumbnails}
                                </li>
                                <li>
                                    code: ${producto.code}
                                </li>
                            </p>
                        </div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${producto.id}">Eliminar</button>
                        </div>
                    </div>`
    });
    products.innerHTML = productos;
    btnEliminar()
})


formulario.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.target))
    data['price'] = Number(data['price'])
    data['stock'] = Number(data['stock'])
    console.log(data)//objeto del formulario
    

    socket.emit('product', data)
    socket.on('message', (res) => {
        if(res.status === 'error') {
            console.log("error")
        }
        else{
            console.log("sin error")
        }
    })

   
    formulario.reset()
})