import { validateBook } from "./validation.js";
import { createBook, deleteBook, getAllBooks, getBooksPaged, getBookById, updateBook, searchBooksbyGenre, searchBooksbyAuthor, searchBooksbyTitle, addFavorite, getFavorites, removeFavorite} from "./api.js";
import { formularioLibro, renderBookList, renderSkeleton, renderBookDetail, renderBookCard, showToast, showError, clearErrors} from "./ui.js";
import { showView } from "./router.js"; 

const LIMIT = 10;

let currentPage = 1;

async function cargarPagina(pagina) {
    renderSkeleton();
    try {
        const books = await getBooksPaged(pagina, LIMIT);
        renderBookList(books);
        setupVerDetalle();
        currentPage = pagina;
        actualizarPaginacion(books.length);
    } catch (error) {
        const contenedor = document.getElementById("view-listado");
        contenedor.innerHTML = "";
        const p = document.createElement("p");
        p.textContent = "Ocurrió un error al cargar los libros.";
        contenedor.appendChild(p);
    }
}

function actualizarPaginacion(cantLibros) {
    const paginacion = document.getElementById("paginacion");
    const btnAnterior = document.getElementById("btn-anterior");
    const btnSiguiente = document.getElementById("btn-siguiente");
    const paginaActual = document.getElementById("pagina-actual");
    paginacion.classList.remove("hidden");
    paginaActual.textContent = "Página " + currentPage;
    btnAnterior.disabled = currentPage === 1;
    btnSiguiente.disabled = cantLibros < LIMIT;
}

function setupPaginacion() {
    document.getElementById("btn-anterior").addEventListener("click", function() {
        if (currentPage > 1) cargarPagina(currentPage - 1);
    });
    document.getElementById("btn-siguiente").addEventListener("click", function() {
        cargarPagina(currentPage + 1);
    });
}

async function init() {
    renderSkeleton();
    try {
        const books = await getBooksPaged(1, LIMIT);
        renderBookList(books);
        setupVerDetalle();
        actualizarPaginacion(books.length);
    } catch (error) {
        console.error("Error al cargar los libros:", error);
        const contenedor = document.getElementById("view-listado");
        const errorElement = document.createElement("p");
        errorElement.textContent = "Ocurrió un error al cargar los libros.";
        contenedor.innerHTML = "";
        contenedor.appendChild(errorElement);  
    }
}

function setUpBookFormularioCrear(){
    const contenedor = document.getElementById("view-crear");
    const form = formularioLibro();
    contenedor.appendChild(form);

    form.addEventListener("submit", function(event){
        event.preventDefault();
        clearErrors();

        const title = form.elements["title"].value;
        const author = form.elements["author"].value;
        const genre = form.elements["genre"].value;
        const description = form.elements["description"].value;
        const year = form.elements["year"].value;
        const cover = form.elements["cover"].value;
        const rating = form.elements["rating"].value;
        
        const bookData = { title, author, genre, description, year, cover, rating };
        const result = validateBook(bookData);

        if (result.valid) {
            createBook(bookData)
            .then(newBook => {
                form.reset();
                showToast("Libro creado correctamente", "exito");
                showView("listado");
                cargarPagina(currentPage);
            })
            .catch(error => {
                showToast("Error al crear el libro. Intentá de nuevo.", "error");
            });
        }else{
            result.errors.forEach(msg => {
                if (msg.includes("Title")) showError("title", msg);
                else if (msg.includes("Author")) showError("author", msg);
                else if (msg.includes("Genre")) showError("genre", msg);
                else if (msg.includes("Description")) showError("description", msg);
                else if (msg.includes("Year")) showError("year", msg);
            });
        }
    });
}

function setupFormularioEditar(book){
    const contenedor = document.getElementById("view-editar");
    contenedor.innerHTML = "";
    const form = formularioLibro();
    contenedor.appendChild(form);

    form.elements["title"].value = book.title;
    form.elements["author"].value = book.author;
    form.elements["genre"].value = book.genre;
    form.elements["description"].value = book.description;
    form.elements["year"].value = book.year;
    form.elements["cover"].value = book.cover;
    form.elements["rating"].value = book.rating;

    form.addEventListener("submit", function(event){
        event.preventDefault();
        clearErrors();

        const title = form.elements["title"].value;
        const author = form.elements["author"].value;
        const genre = form.elements["genre"].value;
        const description = form.elements["description"].value;
        const year = form.elements["year"].value;
        const cover = form.elements["cover"].value;
        const rating = form.elements["rating"].value;
        
        const bookData = { title, author, genre, description, year, cover, rating };

        const result = validateBook(bookData);
        if (result.valid) {
            updateBook(book.id, bookData)
            .then(updatedBook => {
                showToast("Libro actualizado correctamente", "exito");
                showView("listado");
                cargarPagina(currentPage);
            })
            .catch(error => {
                showToast("Error al actualizar el libro. Intentá de nuevo.", "error");
            });
        }else{
            result.errors.forEach(msg => {
                if (msg.includes("Title")) showError("title", msg);
                else if (msg.includes("Author")) showError("author", msg);
                else if (msg.includes("Genre")) showError("genre", msg);
                else if (msg.includes("Description")) showError("description", msg);
                else if (msg.includes("Year")) showError("year", msg);
            });
        }
    }); 
}

function setupEliminar(book) {
    const btnEliminar = document.querySelector(".btn-peligro[data-id='" + book.id + "']");
    if (!btnEliminar) return;

    btnEliminar.addEventListener("click", async function () {
        const confirmar = window.confirm('¿Estás seguro de que querés eliminar "' + book.title + '"?');
        if (!confirmar) return;

        try {
            await deleteBook(book.id);
            const card = document.querySelector("#view-listado .tarjeta button[data-id='" + book.id + "']");
            if (card) card.closest(".tarjeta").remove();
            showToast("Libro eliminado correctamente", "exito");
            showView("listado");
            cargarPagina(currentPage);
        } catch (error) {
            showToast("Error al eliminar el libro. Intentá de nuevo.", "error");
        }
    });
}

function setupBtnEditar(book) {
    const btnEditar = document.querySelector(".detalle-acciones .btn-secundario[data-id='" + book.id + "']");
    if (!btnEditar) return;

    btnEditar.addEventListener("click", function () {
        setupFormularioEditar(book);
        showView("editar");
    });
}

function setupSearchBooks(){
    
    const contenedor = document.getElementById("view-listado");
    const input = document.getElementById("search-input");
    const select = document.getElementById("search-filter");

    input.addEventListener("input", function(){
        const query = input.value;

         //title, author or genre
        const selectedOption = select.value;
        if (selectedOption === "title") {
            searchBooksbyTitle(query)
            .then(books => {
            if (books.length === 0) {
                contenedor.innerHTML = "";
                const errorElement = document.createElement("p");
                errorElement.textContent = "No se encontraron libros.";
                contenedor.appendChild(errorElement);
            } else {
                renderBookList(books);
                setupVerDetalle();
            }
        })
        .catch(error => {
            contenedor.innerHTML = "";
            const errorElement = document.createElement("p");
            errorElement.textContent = "No se encontraron libros.";
            contenedor.appendChild(errorElement);
});
        } else if (selectedOption === "author") {
            searchBooksbyAuthor(query)
            .then(books => {
            if (books.length === 0) {
                contenedor.innerHTML = "";
                const errorElement = document.createElement("p");
                errorElement.textContent = "No se encontraron libros.";
                contenedor.appendChild(errorElement);
            } else {
                renderBookList(books);
                setupVerDetalle();
            }  
        })
        .catch(error => {
            contenedor.innerHTML = "";
            const errorElement = document.createElement("p");
            errorElement.textContent = "No se encontraron libros.";
            contenedor.appendChild(errorElement);
        });         
        } else if (selectedOption === "genre") {
            searchBooksbyGenre(query)
            .then(books => {
            if (books.length === 0) {
                contenedor.innerHTML = "";
                const errorElement = document.createElement("p");
                errorElement.textContent = "No se encontraron libros.";
                contenedor.appendChild(errorElement);
            } else {
                renderBookList(books);
                setupVerDetalle();
            }
        })
        .catch(error => {
            contenedor.innerHTML = "";
            const errorElement = document.createElement("p");
            errorElement.textContent = "No se encontraron libros.";
            contenedor.appendChild(errorElement);
        }); 
        }
    });
}

function setupVerDetalle() {
    const contenedor = document.getElementById("view-listado");
    contenedor.addEventListener("click", async function(event) {
        const boton = event.target.closest(".btn-primario[data-id]");
        if (!boton) return;
 
        const id = boton.dataset.id;
        try {
            const book = await getBookById(id);
            renderBookDetail(book);
            setupEliminar(book);
            setupBtnEditar(book);
        } catch (error) {
            console.error("Error al cargar el detalle del libro:", error);
        }
    });
}

function setupFavoritos() {
    const contenedor = document.getElementById("view-listado");
    
    contenedor.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-favorito")) {
            const bookId = event.target.dataset.id;
            getFavorites()
            .then(favs => {
                const yaExiste = favs.some(fav => fav.bookId === bookId);
                if (yaExiste) {
                    showToast("Este libro ya está en favoritos.");
                } else {
                    addFavorite(bookId)
                    .then(() => showToast("Favorito agregado."))
                    .catch(error => {
                        console.error("Error al agregar favorito:", error);
                        showToast("Error al agregar favorito.");
                    });
                }
            });
        }
    });
} 

function setupVistaFavoritos(){
    showView("favoritos");
    const contenedor = document.getElementById("view-favoritos");
    contenedor.innerHTML = "";
    
    getFavorites()
    .then(fav => {
        const bookPromises = fav.map(fav => 
            getBookById(fav.bookId).catch((error) => null));
        return Promise.all(bookPromises)
    .then(books => {
        books.forEach((book, index) => {
            if (!book) return; // Si no se pudo cargar el libro, lo omitimos
            const tarjeta = renderBookCard(book, false);
            let btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar de favoritos";
            btnEliminar.classList.add("btn-peligro");
            btnEliminar.addEventListener("click", function() {
                removeFavorite(fav[index].id)
                .then(() => {
                    showToast("Favorito eliminado.", "error");
                    tarjeta.remove();
                })
                .catch(error => {
                    console.error("Error al eliminar favorito:", error);
                    showToast("Error al eliminar favorito.");
                });
            });
            tarjeta.appendChild(btnEliminar);
            contenedor.appendChild(tarjeta);
        });
    })
    .catch(error => {
        console.error("Error al cargar favoritos:", error);
    });
})
}


function renderNavbar() {
    const navbar = document.getElementById("navbar");

    let logo = document.createElement("span");
    logo.textContent = "Mar´s Book Blog";
    logo.classList.add("navbar-logo");
    navbar.appendChild(logo);

    let acciones = document.createElement("div");
    acciones.classList.add("navbar-acciones");
    navbar.appendChild(acciones);

    let btnInicio = document.createElement("button");
    btnInicio.textContent = "Inicio";
    btnInicio.classList.add("btn-secundario");
    btnInicio.addEventListener("click", function() {
        showView("listado");
    });
    acciones.appendChild(btnInicio);

    let btnFavoritos = document.createElement("button");
    btnFavoritos.textContent = "Favoritos";
    btnFavoritos.classList.add("btn-secundario");
    btnFavoritos.addEventListener("click", function() {
        setupVistaFavoritos();
    });
    acciones.appendChild(btnFavoritos);

    let btnCrear = document.createElement("button");
    btnCrear.textContent = "Crear Libro";
    btnCrear.classList.add("btn-primario");
    btnCrear.addEventListener("click", function() {
        showView("crear");
    });
    acciones.appendChild(btnCrear);
}

    

init();
renderNavbar();
setUpBookFormularioCrear();
setupSearchBooks();
setupFavoritos();
setupPaginacion();