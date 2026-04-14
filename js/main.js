import { validateBook } from "./validation.js";
import { createBook, getAllBooks, updateBook } from "./api.js";
import { formularioLibro, renderBookList, renderSkeleton} from "./ui.js";


async function init() {
    renderSkeleton();
    try {
        const books = await getAllBooks();
        renderBookList(books);
    } catch (error) {
        console.error("Error al cargar los libros:", error);
        const contenedor = document.getElementById("view-listado");
        const errorElement = document.createElement("p");
        errorElement.textContent = "Ocurrió un error al cargar los libros.";
        contenedor.innerHTML = "";
        contenedor.appendChild(errorElement);  }
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
            })
            .catch(error => {
                console.error("Error al actualizar el libro:", error);
            });
        }else{
            console.log("Errores de validación:", result.errors);
        }

    }); 
}

export { init, setUpBookFormularioCrear, setupFormularioEditar };

init();
setUpBookFormularioCrear();