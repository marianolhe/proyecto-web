const BASEURL = "https://69daf8b2560857310a073292.mockapi.io/proyecto/";

async function getAllBooks() {
        const response = await fetch(BASEURL + "books");
        if (!response.ok) {
            throw new Error("Error fetching books: " + response.status);
        }
        const books = await response.json();
        return books;
}

async function getBookById(id) {
        const response = await fetch(BASEURL + "books/" + id);
        if (!response.ok) {
            throw new Error("Error fetching book: " + response.status);
        }
        const book = await response.json();
        return book;
}

async function createBook(bookData){
    const response = await fetch(BASEURL + "books" ,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    });
    if (!response.ok) {
        throw new Error("Error creating book: " + response.status);
    }
    const newbook = await response.json();
    return newbook;
}

async function updateBook(id, bookData){
    const response = await fetch(BASEURL + "books/" + id ,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData)
    });
    if (!response.ok) {
        throw new Error("Error updating book: " + response.status);
    }
    const updatedBook = await response.json();
    return updatedBook;
}

async function deleteBook(id){
    const response = await fetch(BASEURL + "books/" + id ,{
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error deleting book: " + response.status);
    }
    return await response.json(
    )
}

async function searchBooksbyTitle(query) {
    const response = await fetch(BASEURL + "books?title=" + encodeURIComponent(query));
    if (!response.ok) {
        throw new Error("Error searching books: " + response.status);
    }
    const results = await response.json();
    return results;
}

async function searchBooksbyAuthor(query) {
    const response = await fetch(BASEURL + "books?author=" + encodeURIComponent(query));
    if (!response.ok) {
        throw new Error("Error searching books: " + response.status);
    }
    const results = await response.json();
    return results;
}

async function searchBooksbyGenre(query) {
    const response = await fetch(BASEURL + "books?genre=" + encodeURIComponent(query));
    if (!response.ok) {
        throw new Error("Error searching books: " + response.status);
    }
    const results = await response.json();
    return results;
}


async function getFavorites() {
    const response = await fetch (BASEURL + "favorites");
    if (!response.ok) {
        throw new Error("Error fetching favorites: " + response.status);
    }
    const favorites = await response.json();
    return favorites;
}

async function addFavorite(bookId) {
    const response = await fetch(BASEURL + "favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
    });
    if (!response.ok) {
        throw new Error("Error adding favorite: " + response.status);
    }
    const newFavorite = await response.json();
    return newFavorite;
}

async function removeFavorite(favoriteId) {
    const response = await fetch(BASEURL + "favorites/" + favoriteId, {
        method: "DELETE"
    });
    if (!response.ok) {
        throw new Error("Error removing favorite: " + response.status);
    }
    return await response.json();
}   

export { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchBooksbyTitle, searchBooksbyAuthor, searchBooksbyGenre, getFavorites, addFavorite, removeFavorite };