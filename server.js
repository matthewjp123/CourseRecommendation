const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/profile_page.html");
});

app.use(express.static(__dirname)); // Serve files from the current directory

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
