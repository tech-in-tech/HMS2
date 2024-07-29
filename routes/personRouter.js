// ! this is called express routing
// *Import express
const express = require('express');
// *Create router using express.Router() function
const router = express.Router();

// * Import Person schema from ('./../models/person')
const Person = require('../models/person');
const { rearg } = require('lodash');

// Import {jwtAuthMiddleware,generateToken} from jwt.js file
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const { json } = require('body-parser');

//* Define a POST route at the endpoint '/person' to save person data
router.post('/signup', async (req, res) => {
  try {
    //* Extract the data from the request body
    const data = req.body
    //* Create a new instance of the Person model and insert the data in it
    const newPerson = new Person(data);
    //* Save the new person to the database and make it await because it a DB operation
    const response = await newPerson.save();
    //* Log a message indicating that the data was saved successfully
    console.log('Person data added successfully');

    const payload = {
      id : response.id,
      username : response.username
    }

    // Generate token with the help of response.username and response.is(payload)
    const token = generateToken(payload)
    console.log("token is : ", token);

    //* Send a successful response and token back to the client with the saved data
    res.status(200).json({ response: response, token: token });
  } catch (error) {
    //* Log the error to the console for debugging purposes
    console.log(error);
    //* Send an error response back to the client with a status code 500 and an error message
    res.status(200).json({ error: "INTERNAL SERVER ERROR" });
  }
})


// * Login route
router.post("/login",async (req,res)=>{
  try {
    // * Extract username and password from req.body
    const {username,password} = req.body;
    // *find the user by username
    const user = await Person.findOne({username:username});
    // * If user does not exist or password does not match, return error
    if(!user  || !(await user.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'});
    }

    // if user is present and password is correct then generate token
    const payload={
      id:user.id,
      username:user.username
    }
    // * create token
    const token = generateToken(payload);
    // ?return token as response;
    res.json({token});

  } catch (error) {
    console.log(error);
    res.status(500).json({error:"Internal server error"});
  }
})


//* Define a GET route at the endpoint '/person' to get all persons data
router.get('/',jwtAuthMiddleware, async (req, res) => {
  try {
    //* Fetch all documents from the 'Person' collection in the database
    const data = await Person.find();
    //* Log a message indicating that the data was fetched successfully
    console.log("data fetched");
    //* Send a successful response back to the client with the fetched data
    res.status(200).json(data);
  } catch (error) {
    //* Log the error to the console for debugging purposes
    console.log(error)
    //* Send an error response back to the client with a status code 500 and an error message
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})

// Profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try {
    // fetch user data from token
    const userData = req.user;
    console.log("Userdata : ",userData);
    // fetch userId from userdata
    const userId = userData.id;
    // find the person by userid
    const user = await Person.findById(userId);
    // send ok status
    res.status(200).json({user});
  } catch (error) {
    // in case of some error
    console.log(err);
    res.status(500),json({error:"INTERNAL SERVER ERROR"});
  }
})


// *GET route at the endpoint /person/:workType to get the person data for a particular work type ["waiter","chef","manager"];
router.get('/:workType', async (req, res) => {
  try {
    // * Extract the workType parameter from the request URL
    workType = req.params.workType
    // * Check if the workType is one of the valid types ["waiter", "chef", "manager"]
    if (workType == "chef" || workType == "manager" || workType == "waiter") {
      // * data base Query to find persons with the specified work type
      const response = await Person.find({ work: workType })
      // * Log a message indicating that the data was fetched successfully
      console.log(`Person data of work type ${workType} is fatched`);
      // * Send a successful response back to the client with the fetched data
      res.status(200).json(response);
    }
    else {
      // * If the workType is not valid, send a 404 error response with a message
      res.status(404).json({ error: "INVALID WORK TYPE" });
    }
  } catch (error) {
    // * Log any errors to the console for debugging purposes
    console.log(error);
    // * Send an error response back to the client with a status code 500 and an error message
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})


// *Define the PUT route to update a person's data by their ID at endpoint /person/:id 
router.put('/:id', async (req, res) => {
  try {
    //* Extract the person's ID from the URL parameters
    const personId = req.params.id;
    //* Extract the data to be updated from the request body
    const personDataToBeUpdate = req.body;
    //* Find the person by ID and update their data with the new data
    //* 'new: true' option returns the updated document
    //* 'runValidators: true' option runs validation on the updated data
    const updatedPersonData = await Person.findByIdAndUpdate(personId, personDataToBeUpdate, {
      new: true,
      runValidators: true
    })
    //* If no person is found with the given ID, send a 404 response
    if (!updatedPersonData) {
      return res.status(404).json({ error: 'Person not found' });
    }
    //* Log a message indicating that the person's data was updated
    console.log(`Person data of ID : ${personId} is updated`);
    //* Send the updated person's data as a JSON response with a 200 status code
    res.status(200).json(updatedPersonData);

  } catch (error) {
    //* Log any errors that occur and send a 500 response
    console.log(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})



// *Define the DELETE route to delete a person's data by their ID at endpoint /person/:id 
router.delete('/:id', async (req, res) => {
  try {
    //* Extract the person's ID from the URL parameters
    const personId = req.params.id;
    //* Extract the data to be deleted from the req.body
    const deletedPerson = await Person.findByIdAndDelete(personId);
    //* If no person is found with the given ID, send a 404 response
    if (!deletedPerson) {
      return res.status(404).json({ error: 'Person not found' });
    }
    //* Log a message indicating that the person's data was deleted
    console.log(`Person data of ID : ${personId} is deleted`);
    //* Send the JSON response with a 200 status code and message "Person Deleted Successfully"
    res.status(200).json({ message: "Person Deleted Successfully" })
  } catch (error) {
    //* Log any errors that occur and send a 500 response
    console.log(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})

// * export router
module.exports = router;