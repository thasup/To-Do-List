// Require modules
const express = require("express");
const ejs = require("ejs");
const date = require(`${__dirname}/date.js`);
const mongoose = require("mongoose");
const _ = require('lodash');
const dotenv = require('dotenv');
dotenv.config();

// Setup an instance of app
const app = express();

// Setup EJS
app.set("view engine", "ejs");

// Add middleware
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));

// Setup todolistDB database
const password = process.env.MONGODB_PASSWORD;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://admin-first:88888888@cluster0.hi5zx.mongodb.net/todolistDB`);
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

// Define day format
const day = date.getDate();
// console.log(day);

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
            // mongoose.connection.close();
            res.render("list", {
                listTitle: "Today",
                newListItems: foundItems
            });
        };
    });
});

// POST route for retrieve input data from request
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    // console.log(item);

    const item = new Item({
        name: itemName
    });

    // console.log({listName, day});

    if (listName === "Today") {
        console.log("equal");
        item.save();
        res.redirect("/");
    } else {
        // Find only one on database and return one obj.
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect(`/${listName}`);
        });
    }
});

app.post("/delete", (req, res) => {
    const cheackItemId = req.body.del;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(cheackItemId, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Successfully delete id:${cheackItemId} task.`);
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate(
            // Find list that has name equal to "listName"
            {name: listName},
            // Find an array that object inside of this array has id equal to "cheackItemId" and delete this object
            {$pull: {items: {_id: cheackItemId}}},
            // Run callback function to redirect to that custom list page
            (err, foundList) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Successfully delete id:${cheackItemId} task on ${listName} list.`);
                    res.redirect(`/${listName}`);
                }
            }
        );
    }
});

app.get("/:newList", (req, res) => {
    const customListName = _.capitalize(req.params.newList);

    // Find only one on database and return one obj.
    List.findOne({name: customListName}, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // Create a new list
                console.log("Doesn't exist. Create a new list.");

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect(`/${customListName}`);
            } else {
                // Show an existing list
                console.log(`Exist! and redirect to localhost:3000/${customListName}`);

                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            }
        };
    });
});

// GET route for about page
app.get("/about", (req, res) => {
    res.render("about");
});