const socket = io();

document.getElementById('btnEnviar').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const thumbnails = document.getElementById('thumbnails').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const status = document.getElementById('status').value === "true";

    const newProduct = {
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status
    };

    socket.emit('addProduct', newProduct);
});

// Listen for the updated product list
socket.on('products', products => {
    const contenedorProductos = document.getElementById('contenedorProductos');
    contenedorProductos.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <button class="delete-button" data-id="${product.id}">Eliminar</button>
        `;
        contenedorProductos.appendChild(productElement);
    });

    // Add event listeners for the delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            socket.emit('deleteProduct', productId);
        });
    });
});
