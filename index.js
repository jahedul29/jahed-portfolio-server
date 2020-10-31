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
  const collection = client.db(process.env.DB_NAME).collection("admindetails");
  console.log("Database connection established");
  console.log(process.env.DB_USER);
  client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
