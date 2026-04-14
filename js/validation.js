function validateBook(data) {
    let errors = [];
    if (data.title.length < 5) {
        errors.push("Title must be at least 5 characters long");
    }
    if (data.author == "") {
        errors.push("Author is required");
    }
    if (data.genre == "") {
        errors.push("Genre is required");
    }
    if (data.description.length < 20) {
        errors.push("Description must be at least 20 characters long");
    }
    if (data.year == "") {
        errors.push("Year is required");
    } else if (isNaN(data.year)) {
        errors.push("Year must be a number");
    }
    let valid = errors.length === 0;
    return { valid, errors };
}

export { validateBook };
