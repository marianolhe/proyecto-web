import { showView } from "./router.js";

function renderBookCard(book, mostrarFavorito = true){
        let tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta");

        let nombrel = document.createElement("h2");
        nombrel.textContent = book.title;
        tarjeta.appendChild(nombrel);

        let autorl = document.createElement("p");
        autorl.textContent = "Autor: " + book.author;
        tarjeta.appendChild(autorl);

        let body = document.createElement("div");
        body.classList.add("tarjeta-body");
        tarjeta.appendChild(body);

        let badgeGenero = document.createElement("span");
        badgeGenero.classList.add("badge-genero");
        badgeGenero.textContent = book.genre;
        body.appendChild(badgeGenero);

        let rating = document.createElement("p");
        rating.classList.add("rating");
        rating.textContent = "⭐ " + book.rating + " / 5";
        body.appendChild(rating);

        let imagen = document.createElement("img");
        imagen.src = book.cover;
        imagen.alt = book.title;
        tarjeta.appendChild(imagen);

        let boton = document.createElement("button");
        boton.textContent = "Ver detalles";
        boton.classList.add("btn-primario");
        boton.dataset.id = book.id;
        tarjeta.appendChild(boton);

        if(mostrarFavorito) {
            let botonFav = document.createElement("button");
            botonFav.textContent = "Agregar a favoritos";
            botonFav.classList.add("btn-favorito", "btn-secundario");
            botonFav.dataset.id = book.id;
            tarjeta.appendChild(botonFav);
        }

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

function renderBookDetail(book) {
    const contenedor = document.getElementById("view-detalle");
    contenedor.innerHTML = "";
 
    // Encabezado
    let header = document.createElement("div");
    header.classList.add("detalle-header");
    contenedor.appendChild(header);
 
    let imagen = document.createElement("img");
    imagen.src = book.cover;
    imagen.alt = book.title;
    imagen.classList.add("detalle-cover");
    header.appendChild(imagen);
 
    let info = document.createElement("div");
    info.classList.add("detalle-info");
    header.appendChild(info);
 
    let titulo = document.createElement("h1");
    titulo.classList.add("detalle-titulo");
    titulo.textContent = book.title;
    info.appendChild(titulo);
 
    let autor = document.createElement("p");
    autor.classList.add("detalle-autor");
    autor.textContent = book.author;
    info.appendChild(autor);
 
    let meta = document.createElement("div");
    meta.classList.add("detalle-meta");
    info.appendChild(meta);
 
    let badgeGenero = document.createElement("span");
    badgeGenero.classList.add("badge-genero");
    badgeGenero.textContent = book.genre;
    meta.appendChild(badgeGenero);
 
    let anio = document.createElement("span");
    anio.textContent = "📅 " + book.year;
    meta.appendChild(anio);
 
    let rating = document.createElement("span");
    rating.textContent = "⭐ " + book.rating + " / 5";
    meta.appendChild(rating);
 
    // Descripción
    let descripcion = document.createElement("p");
    descripcion.classList.add("detalle-descripcion");
    descripcion.textContent = book.description;
    info.appendChild(descripcion);
 
    // Botones de acción 
    let acciones = document.createElement("div");
    acciones.classList.add("detalle-acciones");
    contenedor.appendChild(acciones);
 
    let btnVolver = document.createElement("button");
    btnVolver.textContent = "← Volver";
    btnVolver.classList.add("btn-secundario");
    btnVolver.addEventListener("click", function() {
        showView("listado");
    });
    acciones.appendChild(btnVolver);
 
    let btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-secundario");
    btnEditar.dataset.id = book.id;
    acciones.appendChild(btnEditar);
 
    let btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-peligro");
    btnEliminar.dataset.id = book.id;
    acciones.appendChild(btnEliminar);
 
    showView("detalle");
}

function mostrarToast(mensaje, tipo = "exito") {
    const toast = document.createElement("div");
    toast.textContent = mensaje;
    toast.classList.add("toast");
    if (tipo === "error") {
        toast.classList.add("toast-error");
    }
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
}


export { renderBookCard, renderBookList, renderSkeleton, formularioLibro, renderBookDetail, mostrarToast};