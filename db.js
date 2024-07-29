// ! Connection MongoDB database to NodeJS
const mongoose = require('mongoose');    // Import the mongoose library

// config .env
require('dotenv').config();
// * MongoDB connection URI
const mongoURL = process.env.MONGODB_URL_LOCAL
// const mongoURL = process.env.MONGODB_URL


// * Set up MongoDB connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,   // Use the new URL parser instead of the deprecated one
  useUnifiedTopology: true   // Use the new server discovery and monitoring engine
})


//* Get the default connection
//? Mongoose maintains a default connection object representing MongoDB connection
const db = mongoose.connection;


// * define event listner for database connection
db.on('connected', () => {
  console.log("connected to MongoDB server");
})


// * event listner for any error while connection to database
db.on('error', (error) => {
  console.log("MongoDB connection ERROR :: ", error)
})


// * event listner for if database is disconnected 
db.on('disconnected', () => {
  console.log("MongoDB disconnected");
})


// ! Export the database connection
module.exports = db;