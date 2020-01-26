//Definitions
const mongoose = require("mongoose");

//Models
const Festival = require("./models/festival");
      Comment  = require("./models/comment");

//Sample festivals
const seeds = [
    {
        name: "Spring Awakening",
        image: "https://d2mv4ye331xrto.cloudfront.net/wp-content/uploads/2018/12/HEADER4-1200x631.jpg",
        description: "Spring Awakening is a 3-day electronic music festival in Chicago, IL.",
        author: {
            id: "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Electric Daisy Carnival",
        image: "https://www.youredm.com/wp-content/uploads/2019/05/Alex-Perez-for-Insomniac-Events-1.jpg",
        description: "Dance in the desert from dusk 'til dawn for three nights. This massive edm festival takes place annually in Las Vegas.",
        author: {
            id: "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "TomorrowWorld",
        image: "https://cbsnews1.cbsistatic.com/hub/i/2014/11/24/c53f0c64-0545-4550-ab12-34cc491ea577/3.jpg",
        description: "Sugar plum candy canes bonbon gummies pastry wafer fruitcake. Pie chocolate cake gummies. Jelly gummies tiramisu donut. Dessert pudding jelly beans sugar plum cupcake. Sesame snaps chocolate cake icing lollipop. Pudding chocolate bar dragée donut carrot cake topping oat cake wafer brownie. Candy canes gingerbread toffee chocolate sweet roll donut donut halvah chocolate bar.",
        author: {
            id: "588c2e092403d111454fff77",
            username: "Sarah"
        }
    },
    {
        name: "Electric Forest",
        image: "http://downbeats.com/wp-content/uploads/Sherwood-Forest-EF.jpg",
        description: "Cupcake carrot cake croissant marshmallow dessert toffee gummies chupa chups. Tiramisu pie chocolate bar. Biscuit candy canes bear claw muffin donut. Fruitcake cake muffin fruitcake sweet roll muffin chupa chups. Jujubes dragée gummies cheesecake jelly-o. Biscuit jelly-o chupa chups tart jelly beans. Jelly croissant jelly cookie bear claw carrot cake. Candy bonbon caramels cotton candy. Powder halvah fruitcake caramels jelly-o wafer caramels biscuit gummi bears.",
        author: {
            id: "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Electric Zoo",
        image: "https://www.billboard.com/files/styles/article_main_image/public/media/02-Electric-Zoo-stage-production-graphic-billboard-1548.jpg",
        description: "Danish jelly-o biscuit brownie. Candy gummi bears liquorice lemon drops. Tootsie roll bonbon candy canes chocolate bar. Jelly-o pastry donut lemon drops. Powder liquorice croissant soufflé gingerbread sesame snaps. Lemon drops donut cheesecake chocolate sweet roll carrot cake chupa chups macaroon.",
        author: {
            id: "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "îlesoniq",
        image: "https://dancingastronaut.com/wp-content/uploads/2018/08/ilesoniq-2016.jpg",
        description: "Cake croissant candy canes bonbon candy canes jelly beans. Jelly beans jelly pastry cupcake candy canes. Sesame snaps pastry bonbon marshmallow gummies marshmallow pudding. Chocolate bar toffee marzipan pastry. Topping liquorice cake donut sweet roll donut bear claw. Wafer caramels oat cake cheesecake bear claw. Biscuit powder apple pie cupcake jelly-o jelly-o toffee cheesecake. Donut sweet carrot cake bonbon gummi bears macaroon pie. Gummies lollipop sweet gummi bears.",
        author: {
            id: "588c2e092403d111454fff77",
            username: "Sarah"
        }
    },
    {
        name: "Ultra",
        image: "https://www.edmtunes.com/wp-content/uploads/2018/03/PH_0326_UMF01.jpg",
        description: "Halvah caramels sugar plum fruitcake tootsie roll toffee. Apple pie cotton candy toffee halvah pastry brownie pudding pudding. Candy canes bear claw caramels cotton candy bonbon gummies sugar plum. Sweet roll brownie sugar plum tiramisu jelly-o sweet bear claw wafer. Cupcake tart jelly candy canes gummies pie pudding cupcake. Tootsie roll sweet roll tootsie roll wafer pudding.",
        author: {
            id: "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Movement",
        image: "https://www.youredm.com/wp-content/uploads/2018/06/34072640_1837611946261130_6042930109713743872_o-1050x600.jpg",
        description: "Gingerbread macaroon lemon drops cake sweet roll caramels ice cream jelly beans. Bonbon jujubes cheesecake. Bonbon danish bonbon oat cake danish jelly-o. Pastry gummies gummies donut marzipan bonbon powder tootsie roll carrot cake. Jujubes liquorice carrot cake muffin. Sugar plum cookie soufflé. Dessert dragée chocolate cake. Gummies muffin sesame snaps macaroon chocolate bar muffin brownie brownie ice cream. Dragée gingerbread gummi bears lemon drops. Brownie sesame snaps candy canes toffee pie chupa chups lemon drops marshmallow.",
        author: {
            id: "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Second Sky",
        image: "https://i2.wp.com/thissongissick.com/wp-content/uploads/2019/06/Crowd.jpg?resize=750%2C422&quality=88&strip&ssl=1",
        description: "Tart marzipan muffin sesame snaps tiramisu caramels. Lemon drops danish macaroon gummies jelly muffin oat cake. Marzipan liquorice cookie powder cake ice cream. Cookie marzipan candy canes jelly-o chocolate. Liquorice apple pie sugar plum icing sugar plum bonbon soufflé cheesecake pie. Dragée biscuit marzipan cheesecake marshmallow. Gingerbread sweet chocolate bar oat cake. Marzipan powder chocolate. Candy canes candy croissant.",
        author: {
            id: "588c2e092403d111454fff77",
            username: "Sarah"
        }
    }
];

async function seedDB() {
    await Festival.deleteMany({}); //remove all festivals from the database
    await Comment.deleteMany({}); //remove all comments from the database

    //Add same, fake comment to each seeded festival
    for(const seed of seeds) {
        let festival = await Festival.create(seed); //create each festival in seeds array
        let comment = await Comment.create( //add the same comment to each festival
            {
                text: 'This place is great, but I wish there was internet',
                author: {
                    id: "588c2e092403d111454fff77",
                    username: "Sarah"
                }
            }
        );
        festival.comments.push(comment); //push the comment to comments array for each festival
        festival.save(); //save each festival
    };
};

module.exports = seedDB;