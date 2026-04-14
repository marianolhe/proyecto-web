function renderBookCard(book){
        let tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        let nombrel = document.createElement("h2");
        nombrel.textContent = book.title;
        tarjeta.appendChild(nombrel);

        let autorl = document.createElement("p");
        autorl.textContent = "Autor: " + book.author;
        tarjeta.appendChild(autorl);

        let genero = document.createElement("p");
        genero.textContent = "Género: " + book.genre;
        tarjeta.appendChild(genero);

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

function formularioLibro() {
    let form = document.createElement("form");
    
    let titleLabel = document.createElement("label");
    titleLabel.textContent = "Título:";
    form.appendChild(titleLabel);

    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.name = "title";
    form.appendChild(titleInput);

    let authorLabel = document.createElement("label");
    authorLabel.textContent = "Autor:";
    form.appendChild(authorLabel);

    let authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.name = "author";
    form.appendChild(authorInput);

    let genreLabel = document.createElement("label");
    genreLabel.textContent = "Género:";
    form.appendChild(genreLabel);

    let genreInput = document.createElement("input");
    genreInput.type = "text";
    genreInput.name = "genre";
    form.appendChild(genreInput);

    let descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Descripción:";
    form.appendChild(descriptionLabel);

    let descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    form.appendChild(descriptionInput);

    let yearLabel = document.createElement("label");
    yearLabel.textContent = "Año:";
    form.appendChild(yearLabel);

    let yearInput = document.createElement("input");
    yearInput.type = "number";
    yearInput.name = "year";
    form.appendChild(yearInput);

    let coverLabel = document.createElement("label");
    coverLabel.textContent = "URL de la portada:";
    form.appendChild(coverLabel);

    let coverInput = document.createElement("input");
    coverInput.type = "text";
    coverInput.name = "cover";
    form.appendChild(coverInput);

    let ratingLabel = document.createElement("label");
    ratingLabel.textContent = "Calificación:";
    form.appendChild(ratingLabel);

    let ratingInput = document.createElement("input");
    ratingInput.type = "number";
    ratingInput.name = "rating";
    ratingInput.min = "1";
    ratingInput.max = "5";
    form.appendChild(ratingInput);

    let cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancelar";
    form.appendChild(cancelButton);

    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Guardar";
    form.appendChild(submitButton);

    return form;
}

export { renderBookCard, renderBookList, renderSkeleton, formularioLibro };