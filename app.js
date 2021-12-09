const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", (req, res) => {

    let today = new Date();
    let currentDay = today.getDay();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {
        ejsDay: day,
        newListItems: items
    });
});

app.post("/", (req, res) => {
    const item = req.body.newItem;
    items.push(item);
    console.log(item);

    res.redirect("/");
});