// Require modules
const express = require("express");
const ejs = require("ejs");
const date = require(`${__dirname}/date.js`);
const mongoose = require("mongoose");

// Setup an instance of app
const app = express();

// Setup EJS
app.set("view engine", "ejs");

// Add middleware
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// Setup todolistDB database
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/todolistDB");
};

// Defines the port number
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Create Item module schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please check your data entry, no name is specified."]
    }
});

// Create module
const Item = mongoose.model("Item", itemSchema);

// Add default items
const item1 = new Item ({
    name: "Welcome to yuor To-Do-List!"
});
const item2 = new Item ({
    name: "Hit the + button to add a new item."
});
const item3 = new Item ({
    name: "Check the box on the left side when you completed the task."
});

const defaultItems = [item1, item2, item3];

// Add data on database
Item.insertMany(defaultItems, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("successfully saved!");
        mongoose.connection.close();
    }
});

// GET route for root
app.get("/", (req, res) => {

    const day = date.getDate();

    res.render("list", {
        listTitle: day,
        newListItems: items
    });
});

// POST route for retrieve input data from request
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

// GET route for another list
app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

// POST route for retrieve input data from request
app.post("/work", (req, res) => {
    const item = req.body.newItem;
    workItems.push(item);
    console.log(item);

    res.redirect("/work");
});

// GET route for about page
app.get("/about", (req, res) => {
    res.render("about");
});