const express = require("express");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    // res.sendFile(`${__dirname}`)

    let today = new Date();
    let currentDay = today.getDay();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {
        ejsDay: day
    });
});