// script.js
document.addEventListener("DOMContentLoaded", function() {
    // Find the button element by its id
    const changeTextButton = document.getElementById("changeTextButton");

    // Add a click event listener
    changeTextButton.addEventListener("click", function() {
        // Find the paragraph element by its id
        const textElement = document.getElementById("textToChange");

        // Change the text content
        textElement.textContent = "Text has been changed!";
    });
});
