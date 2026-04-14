import { getAllBooks } from "./api.js";
import { renderBookList, renderSkeleton } from "./ui.js";

async function init() {
  renderSkeleton();

  try {
    const books = await getAllBooks();
    renderBookList(books);
  } catch (error) {
    console.error("Error al cargar los libros:", error);
    const contenedor = document.getElementById("view-listado");
    contenedor.innerHTML = "";

    const divVacio = document.createElement("div");
    divVacio.classList.add("estado-vacio");

    const emoji = document.createElement("span");
    emoji.textContent = "😕";

    const mensaje = document.createElement("p");
    mensaje.textContent = "Ocurrió un error al cargar los libros. Intenta de nuevo.";

    divVacio.appendChild(emoji);
    divVacio.appendChild(mensaje);
    contenedor.appendChild(divVacio);
  }
}

init();