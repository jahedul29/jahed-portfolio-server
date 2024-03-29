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
    const filterObject = {};

    req.query.status && (filterObject.status = req.query.status);
    req.query.category && (filterObject.category = req.query.category);

    projectsCollection.find(filterObject).toArray((err, projects) => {
      if (projects?.length) {
        res.status(200).send(projects);
      } else {
        res.sendStatus(404);
      }
    });
  });

  app.post("/addProject", (req, res) => {
    projectsCollection.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        result.sendStatus(400);
      }
    });
  });

  // Blogs collection processes
  const blogsCollection = client.db(process.env.DB_NAME).collection("blogs");
  app.post("/addBlog", (req, res) => {
    // console.log(req.body);
    blogsCollection.insertOne(req.body).then((result) => {
      if (result.insertedCount > 0) {
        res.status(200).send(result.insertedCount > 0);
      } else {
        res.sendStatus(404);
      }
    });
  });

  app.get("/getBlogs", (req, res) => {
    blogsCollection.find({}).toArray((err, docs) => {
      if (docs?.length > 0) {
        res.status(200).send(docs);
      } else {
        res.sendStatus(400);
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
