const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fieUpload = require("express-fileupload");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n6je5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fieUpload());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// const projects = [
//   {
//     name: "Agency",
//     photo: "https://i.imgur.com/8bwLYpk.png",
//     description:
//       "This is a software service selling website. User can buy listed services by logging into it. User can log in with gmail are registering with a manual email. Admin and User authorization implemented",
//     technologies: "React, Node, Firebase",
//     github: "https://github.com/jahedul29/agency-client",
//     website: "https://agency-jahed.web.app/",
//     video: "https://youtu.be/JnmamCxkXio",
//     status: "Pending",
//   },
//   {
//     name: "Volunteer Network",
//     photo: "https://i.imgur.com/tDks9aq.png",
//     description:
//       "This is a Social Working Platform. User can register any social service by logging into it. User can log in with gmail are registering with a manual email",
//     technologies: "React, Node, Firebase",
//     github: "https://github.com/jahedul29/volunteer-network-client",
//     website: "https://volunteer-network-jahed.web.app",
//     video: "https://www.youtube.com/watch?v=Kxvl0ggq_7w&feature=youtu.be",
//     status: "Pending",
//   },
//   {
//     name: "Hotel Searching App",
//     photo: "https://i.imgur.com/gfDmhSk.png",
//     description:
//       "This is a Hotel Searching App used to search hotels of selected places. User needs to login to the website by google or registering with manual email. User must need to confirm email before login and can change password.",
//     technologies: "React, Firebase, Swiper.js",
//     github: "github.com/jahedul29/travel-guru",
//     website: "travel-guru-jahed.web.app",
//     video: "",
//     status: "Pending",
//   },
//   {
//     name: "Hot Onion",
//     photo: "https://i.imgur.com/KALZo0N.png",
//     description:
//       "This is restaurant app. User can order their desired food through this app. A complete shopping cart functionality implemented User needs to login to the website by registering with manual email. ",
//     technologies: "React, Firebase, Swiper.js",
//     github: "https://github.com/jahedul29/hot-onion",
//     website: "https://hot-onion-83648.web.app/",
//     video: "",
//     status: "Pending",
//   },
// ];

// Connecting to database
client.connect((err) => {
  console.log("Database connection established");

  // admin details collection processes
  const adminDetailsCollection = client
    .db(process.env.DB_NAME)
    .collection("admindetails");

  app.get("/getAdmin", (req, res) => {
    adminDetailsCollection.find({}).toArray((err, docs) => {
      if (docs.length) {
        res.status(200).send(docs[0]);
      } else {
        res.sendStatus(400);
      }
    });
  });

  // messages collection processes
  const messagesCollection = client
    .db(process.env.DB_NAME)
    .collection("messages");

  app.post("/sendMessage", (req, res) => {
    messagesCollection.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        res.sendStatus(404);
      }
    });
  });

  // Project collection processes
  const projectsCollection = client
    .db(process.env.DB_NAME)
    .collection("projects");

  app.get("/getProjects", (req, res) => {
    projectsCollection.find({}).toArray((err, projects) => {
      if (projects.length) {
        res.status(200).send(projects);
      } else {
        res.sendStatus(404);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
