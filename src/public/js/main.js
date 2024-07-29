document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const renderProductos = (data) => {
        const contenedorProductos = document.getElementById("contenedorProductos");
        if (contenedorProductos) {
            contenedorProductos.innerHTML = "";

            data.forEach(item => {
                const thumbnails = Array.isArray(item.thumbnails) ? item.thumbnails.join(", ") : item.thumbnails || 'No disponibles';

                const card = document.createElement("div");
                card.innerHTML = `
                    <p>ID: ${item._id}</p>
                    <p>Título: ${item.title}</p>
                    <p>Descripción: ${item.description}</p>
                    <p>Precio: ${item.price}</p>
                    <p>Miniaturas: ${thumbnails}</p>
                    <p>Código: ${item.code}</p>
                    <p>Stock: ${item.stock}</p>
                    <p>Categoría: ${item.category}</p>
                    <p>Estado: ${item.status ? "Disponible" : "No disponible"}</p>
                    <button class="delete-button" data-id="${item._id}">Eliminar ❌</button>
                `;
                contenedorProductos.appendChild(card);

                const eliminarButton = card.querySelector(".delete-button");
                if (eliminarButton) {
                    eliminarButton.addEventListener("click", () => {
                        eliminarProducto(item._id);
                    });
                }
            });
        } else {
            console.error("contenedorProductos no encontrado en el DOM");
        }
    };

    const eliminarProducto = (id) => {
        socket.emit("deleteProduct", id);
    };

    const agregarProducto = () => {
        const producto = {
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            thumbnails: document.getElementById("thumbnails").value.split(',').map(item => item.trim()),
            code: document.getElementById("code").value,
            stock: parseInt(document.getElementById("stock").value),
            category: document.getElementById("category").value,
            status: document.getElementById("status").value === "true",
        };

        socket.emit("addProduct", producto);

        // Limpiar los campos del formulario después de enviar el producto
        document.getElementById("title").value = '';
        document.getElementById("description").value = '';
        document.getElementById("price").value = '';
        document.getElementById("thumbnails").value = '';
        document.getElementById("code").value = '';
        document.getElementById("stock").value = '';
        document.getElementById("category").value = '';
        document.getElementById("status").value = 'true';
    };

    socket.on("products", (data) => {
        renderProductos(data);
    });

    const btnEnviar = document.getElementById("btnEnviar");
    if (btnEnviar) {
        btnEnviar.addEventListener("click", agregarProducto);
    } else {
        console.error("btnEnviar no encontrado en el DOM");
    }
});
