const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
})


const renderProducts = (data) => {
    const productCont = document.getElementById("productCont");
    productCont.innerHTML = "";

    data.products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("productCont");

        card.innerHTML = `
                            <p>Producto: ${item.title} </p>
                            <p>Descripcion: ${item.description} </p>
                            <p>Precio: ${item.price} </p>
                            <p>Stock: ${item.stock} </p>
                            <button class="btn btn-warning"> Eliminar </button>
                        `
        productCont.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item._id);
        })
    })

    const pageControls = document.createElement("div");
    pageControls.classList.add("pagination-controls");

    if (data.hasPrevPage) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";
        prevButton.classList.add("btn", "btn-primary");
        prevButton.addEventListener("click", () => {
            socket.emit("getProducts", { page: data.prevPage, limit: 5 });
        });
        pageControls.appendChild(prevButton);
    }

    const pageInfo = document.createElement("p");
    pageInfo.textContent = `Página ${data.currentPage} de ${data.totalPages}`;
    pageInfo.classList.add("pageInfo");
    pageControls.appendChild(pageInfo);

    if (data.hasNextPage) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Siguiente";
        nextButton.classList.add("btn", "btn-primary");
        nextButton.addEventListener("click", () => {
            socket.emit("getProducts", { page: data.nextPage, limit: 5 });
        });
        pageControls.appendChild(nextButton);
    }

    const existingPageControls = document.querySelector(".pagination-controls");
    if (existingPageControls) {
        existingPageControls.remove();
    }

    productCont.appendChild(pageControls);
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)

}


document.getElementById("btnEnviar").addEventListener("click", () => {
    addProduct();
})


const addProduct = () => {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value,
    }

    socket.emit("addProduct", product);
}