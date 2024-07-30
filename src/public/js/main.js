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
        const titleElement = document.getElementById("title");
        const descriptionElement = document.getElementById("description");
        const priceElement = document.getElementById("price");
        const thumbnailsElement = document.getElementById("thumbnails");
        const codeElement = document.getElementById("code");
        const stockElement = document.getElementById("stock");
        const categoryElement = document.getElementById("category");
        const statusElement = document.getElementById("status");

        if (!titleElement || !descriptionElement || !priceElement || !thumbnailsElement || !codeElement || !stockElement || !categoryElement || !statusElement) {
            console.error("Uno o más elementos del formulario no fueron encontrados en el DOM.");
            return;
        }

        const producto = {
            title: titleElement.value,
            description: descriptionElement.value,
            price: parseFloat(priceElement.value),
            thumbnails: thumbnailsElement.value.split(',').map(item => item.trim()),
            code: codeElement.value,
            stock: parseInt(stockElement.value),
            category: categoryElement.value,
            status: statusElement.value === "true",
        };

        socket.emit("addProduct", producto);

        // Limpiar los campos del formulario después de enviar el producto
        titleElement.value = '';
        descriptionElement.value = '';
        priceElement.value = '';
        thumbnailsElement.value = '';
        codeElement.value = '';
        stockElement.value = '';
        categoryElement.value = '';
        statusElement.value = 'true';
    };

    socket.on("products", (data) => {
        renderProductos(data);
    });

    const btnAgregarProducto = document.getElementById("btnAgregarProducto");
    if (btnAgregarProducto) {
        btnAgregarProducto.addEventListener("click", agregarProducto);
    } else {
        console.error("btnAgregarProducto no encontrado en el DOM");
    }
});
