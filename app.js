const express = require("express");
const ejs = require("ejs");
const date = require(`${__dirname}/date.js`);

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", (req, res) => {

    const day = date.getDate();

    res.render("list", {
        listTitle: day,
        newListItems: items
    });
});

app.post("/", (req, res) => {
    const item = req.body.newItem;
    console.log(item);

    if (req.body.list === "Work") {
        workItems.push(item)
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.post("/work", (req, res) => {
    const item = req.body.newItem;
    workItems.push(item);
    console.log(item);

    res.redirect("/work");
});

app.get("/about", (req, res) => {
    res.render("about");
});