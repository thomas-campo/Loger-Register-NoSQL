const socket = io();
const productsToCart = document.getElementById('productsToCart');
const formulario = document.getElementById('form');

socket.on('productsToCart', data => {

    let productos = ''
    data.forEach(product => {
        productos +=`<div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
                        <div class="card-body">
                            <h4 class="card-title">${product.title}</h4>
                            <p class="card-text">
                                <li>
                                    id: ${product._id}
                                </li>
                                <li>
                                    description: ${product.description}
                                </li>
                                <li>
                                    price: $${product.price}
                                </li>
                                <li>
                                    category: ${product.category}
                                </li>
                                <li>
                                    status: ${product.status}
                                </li>
                                <li>
                                    stock: ${product.stock}
                                </li>
                                <li>
                                    thumbnail: ${product.thumbnails}
                                </li>
                                <li>
                                    code: ${product.code}
                                </li>
                            </p>
                        </div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${product.id}">Eliminar</button>
                        </div>
                    </div>`
    });
    productsToCart.innerHTML = productos;
    btnEliminar()
})