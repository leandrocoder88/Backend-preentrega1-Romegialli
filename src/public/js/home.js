const socket = io();

const listProducts = (data) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ``;

    data.products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("col-md-4", "mb-4");

        card.innerHTML = `
            <div class="card h-100">
                <img src="" class="" alt="">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">${item.description}</p>
                    <p class="card-text"><strong>Precio:</strong> $${item.price}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <input type="number" id="quantity-${item._id}" placeholder="Cantidad" min="0" max="${item.stock}" class="form-control w-50">
                        <button class="btn btn-primary ml-2 btn-add-to-cart" data-id="${item._id}">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        `;

        productList.appendChild(card);
    });

    const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 0;

            if (quantity > 0) {
                socket.emit("addProdToCart", [{ id: productId, quantity: quantity }]);
            }
        });
    });

    const pageControls = document.createElement("div");
    pageControls.classList.add("pagination-controls", "d-flex", "justify-content-between", "align-items-center", "mt-4");

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
    pageInfo.classList.add("pageInfo", "font-weight-bold");
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

    productList.appendChild(pageControls);
};

socket.on("products", (data) => {
    listProducts(data);
});

socket.on('redirect', (data) => {
    window.location.href = data.url;
});
