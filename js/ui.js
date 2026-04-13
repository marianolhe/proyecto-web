function renderBookCard(book){
        let tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        let nombrel = document.createElement("h2");
        nombrel.textContent = book.title;
        tarjeta.appendChild(nombrel);

        let autorl = document.createElement("p");
        autorl.textContent = "Autor: " + book.author;
        tarjeta.appendChild(autorl);

        let imagen = document.createElement("img");
        imagen.src = book.cover;
        tarjeta.appendChild(imagen);

        let boton = document.createElement("button");
        boton.textContent = "Ver detalles";
        boton.dataset.id = book.id;
        tarjeta.appendChild(boton);

        return tarjeta;
    }

function renderBookList(books){
    const contenedor = document.getElementById("view-listado");
    contenedor.innerHTML = "";
    books.forEach(
        function(book){
            const libroCard = renderBookCard(book);
            contenedor.appendChild(libroCard);
        }
    )
}

function renderSkeleton(){
    const contenedor = document.getElementById("view-listado");
    contenedor.innerHTML = "";
    for(let i = 0; i < 5; i++){
        let skeletonCard = document.createElement("div");
        skeletonCard.classList.add("skeleton-card");
        contenedor.appendChild(skeletonCard);
    }
}

export { renderBookCard, renderBookList, renderSkeleton };