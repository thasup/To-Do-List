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

// Create List module schema
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

// Create module
const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

// Add default items
const item1 = new Item ({
    name: "Welcome to your To-Do-List!"
});
const item2 = new Item ({
    name: "Hit the + button to add a new item."
});
const item3 = new Item ({
    name: "Check the box on the left side when you completed the task."
});

const defaultItems = [item1, item2, item3];

// Find data on database
// Item.find((err, items) => {
//     if(err) {
//         console.log(err);
//     } else {
//         items.forEach((item) => {
//             console.log(item);
//         });
//         mongoose.connection.close();
//     }
// });

// GET route for root
app.get("/", (req, res) => {

    // Find all on database and return an array
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            // Add data on database
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully saved!");
                    // mongoose.connection.close();
                }
            });
            res.redirect("/");
        } else {
            const day = date.getDate();
            // mongoose.connection.close();

            res.render("list", {
                listTitle: day,
                newListItems: foundItems
            });
        };
    });
});

// POST route for retrieve input data from request
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    // console.log(item);

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const cheackDeleted = req.body.del;

    Item.findByIdAndRemove(cheackDeleted, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Successfully delete id:${cheackDeleted} task.`);
            res.redirect("/");
        }
    });
});

app.get("/:newList", (req, res) => {
    const customListName = req.params.newList;

    // Find only one on database and return one obj
    List.findOne({name: customListName}, (err, foundLists) => {
        if (!err) {
            if (!foundLists) {
                // Create a new list
                console.log("Doesn't exist!");

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect(`/${customListName}`)
            } else {
                // Show an existing list
                console.log("Exist!");

                res.render("list", {
                    listTitle: foundLists.name,
                    newListItems: foundLists.items
                });
            }
        };
    });

    

    
});

// GET route for about page
app.get("/about", (req, res) => {
    res.render("about");
});