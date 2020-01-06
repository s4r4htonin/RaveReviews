//Definitions
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

//temporary array to hold festival objects; will eventually be replaced by a database
let festivals = [
    { name: "Spring Awakening", image: "https://d2mv4ye331xrto.cloudfront.net/wp-content/uploads/2018/12/HEADER4-1200x631.jpg" },
    { name: "Electric Daisy Carnival", image: "https://www.youredm.com/wp-content/uploads/2019/05/Alex-Perez-for-Insomniac-Events-1.jpg" },
    { name: "TomorrowWorld", image: "https://cbsnews1.cbsistatic.com/hub/i/2014/11/24/c53f0c64-0545-4550-ab12-34cc491ea577/3.jpg" },
    { name: "Electric Forest", image: "http://downbeats.com/wp-content/uploads/Sherwood-Forest-EF.jpg" },
    { name: "Electric Zoo", image: "https://www.billboard.com/files/styles/article_main_image/public/media/02-Electric-Zoo-stage-production-graphic-billboard-1548.jpg" },
    { name: "îlesoniq", image: "https://dancingastronaut.com/wp-content/uploads/2018/08/ilesoniq-2016.jpg" },
    { name: "Ultra", image: "https://www.edmtunes.com/wp-content/uploads/2018/03/PH_0326_UMF01.jpg" },
    { name: "Movement", image: "https://www.youredm.com/wp-content/uploads/2018/06/34072640_1837611946261130_6042930109713743872_o-1050x600.jpg" },
    { name: "Second Sky", image: "https://i2.wp.com/thissongissick.com/wp-content/uploads/2019/06/Crowd.jpg?resize=750%2C422&quality=88&strip&ssl=1" }
];

app.use(bodyParser.urlencoded({ extended: true }));

//Tells express that /views are ejs files
app.set("view engine", "ejs");

//Home page
app.get("/", function (req, res) {
    res.render("landing");
});

//Festivals
app.get("/festivals", function (req, res) {
    res.render("festivals", { festivals: festivals });
});

//Create a new festival
app.post("/festivals", function (req, res) { //get data from form and add to festivals array
    let newFestival = {
        name: req.body.festivalName,
        image: req.body.imageUrl
    };
    festivals.push(newFestival);
    res.redirect("/festivals"); //redirect to /festivals 
});

//Form to add a new festival
app.get("/festivals/new", function (req, res) {
    res.render("new");
});

//Start server
app.listen(3000, function () {
    console.log("Server started on port 3000");
});