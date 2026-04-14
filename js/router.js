function showView(viewName) {
    const views = document.querySelectorAll(".view");
    views.forEach(view => {
        if (view.id === "view-" + viewName) {
            view.classList.remove("hidden");
        } else {
            view.classList.add("hidden");
        }
    });
}
export { showView };