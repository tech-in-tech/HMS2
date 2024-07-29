//* Import the express module so we can use it in our application
const express = require('express')


//* Create an instance of an Express application
const app = express()



//* config .env
require("dotenv").config();

// * Import auth file
const passport = require('./auth');


//* taking port fron .env file
const PORT = process.env.PORT || 3000




// *Middleware function to log the date, time, and URL of incoming requests
const logRequest = (req,res,next)=>{
  //* Log the current date and time along with the requested URL
  console.log(`DATE : ${new Date().toLocaleString()}\nURL : http://localhost:${PORT}${req.originalUrl}`)
  //* Call the next function 
  next(); 
}
// * to use middleware function in all the routes
app.use(logRequest);


// *for database connection
const db = require('./db')







// * Import body-parser
const bodyParser = require('body-parser');
// * Convert jsondata to object and send it to req.body
app.use(bodyParser.json());






// * Import Person schema from ('./models/person')
const Person = require('./models/person')


// * Import Person schema from ('./models/menu')
const { words } = require('lodash');


// Initialize Passport middleware to use in the application
app.use(passport.initialize());
// Create a middleware for local authentication
// 'local' refers to the strategy defined using passport-local
// { session: false } indicates that session cookies are not used for maintaining login state
const localAuthMiddleware = passport.authenticate('local',{session:false})



//* Define a route for the home page (root URL '/')
//* When someone visits '/', this function runs
app.get('/',(req, res) => {
  //* Print a message to the console
  res.send("Welcome the the hotel......");
})





// * Import personRouter file
const personRoutes = require('./routes/personRouter');
app.use('/person',localAuthMiddleware, personRoutes);


// * Import menuRouter file
const menuItems = require('./routes/menuRouter');
app.use("/menu", menuItems)



//* Start the server and listen for connections on port 3000
app.listen(PORT, () => {
  //* Print a message to the console when the server starts
  console.log("Listning on port 3000")
})