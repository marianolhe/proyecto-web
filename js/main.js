import { validateBook } from "./validation.js";
import { createBook, getAllBooks, getBookById, updateBook, searchBooksbyGenre, searchBooksbyAuthor, searchBooksbyTitle, addFavorite, getFavorites, removeFavorite} from "./api.js";
import { formularioLibro, renderBookList, renderSkeleton, renderBookDetail, renderBookCard, mostrarToast} from "./ui.js";
import { showView } from "./router.js"; 


async function init() {
    renderSkeleton();
    try {
        const books = await getAllBooks();
        renderBookList(books);
        setupVerDetalle();
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
                console.log("Libro creado:", newBook);
                form.reset();
            })
            .catch(error => {
                console.error("Error al crear el libro:", error);
                mostrarToast("Error al crear el libro.");
            });
        }else{
            console.log("Errores de validación:", result.errors);
        }

    });
}

function setupFormularioEditar(book){
    const contenedor = document.getElementById("view-editar");
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
                console.log("Libro actualizado:", updatedBook);
                mostrarToast("Libro actualizado correctamente.");
            })
            .catch(error => {
                console.error("Error al actualizar el libro:", error);
                mostrarToast("Error al actualizar el libro.");  
            });
        }else{
            console.log("Errores de validación:", result.errors);
        }

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
        const boton = event.target.closest("btn-primario[data-id]");
        if (!boton) return;
 
        const id = boton.dataset.id;
        try {
            const book = await getBookById(id);
            renderBookDetail(book);
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
                    mostrarToast("Este libro ya está en favoritos.");
                } else {
                    addFavorite(bookId)
                    .then(() => mostrarToast("Favorito agregado."))
                    .catch(error => {
                        console.error("Error al agregar favorito:", error);
                        mostrarToast("Error al agregar favorito.");
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
                    mostrarToast("Favorito eliminado.", "error");
                    tarjeta.remove();
                })
                .catch(error => {
                    console.error("Error al eliminar favorito:", error);
                    mostrarToast("Error al eliminar favorito.");
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