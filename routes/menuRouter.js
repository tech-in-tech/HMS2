// ! this is called express routing
// *Import express
const express = require('express')

// *Create router using express.Router() function
const router = express.Router();

// * Import menu schema from ("")
const MenuItems = require('../models/menu');



// *Post route at the endpoint /menu to add menu data to database
router.post('/', async (req, res) => {
  try {
    // * extract the data from req.body 
    const data = req.body
    // * create a new instance of menu model and add menu data in it
    const menuItemsData = new MenuItems(data)
    // * save the response/menuData to the database and make it await because it DB operation
    const response = await menuItemsData.save();
    //* Log a message indicating that the data was saved successfully
    console.log('Menu data save successfully');
    //* Send a successful response back to the client with the saved data
    res.status(200).json(response);

  } catch (error) {
    //* Log the error to the console for debugging purposes
    console.log(error)
    //* Send an error response back to the client with a status code 500 and an error message
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})



// * GET route at the endpoint '/menu' to get all persons data
router.get("/", async (req, res) => {
  try {
    // *fetch all documants from the 'menu' collection in the database
    const data = await MenuItems.find();
    //* Log a message indicating that the data was fetched successfully
    console.log("Menu data fetched successfully");
    //* Send a successful response back to the client with the fetched data
    res.status(200).json(data);
  } catch (error) {
    //* Log the error to the console for debugging purposes
    console.log(error);
    //* Send an error response back to the client with a status code 500 and an error message
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})



// *GET route at the endpoint /menu/:taste to get the menu data for a particular taste type ['sweet', 'spicy', 'sour']; 
router.get('/:taste', async (req, res) => {
  try {
    // * Extract the taste parameter from the request URL
    const tasteType = req.params.taste;
    // * Check if the tasteType is one of the valid types ["sweet", "sour", "spicy"]
    if (tasteType == "sweet" || tasteType == "spicy" || tasteType == "sour") {
      // * data base Query to find MenuItems with the specified taste type
      const response = await MenuItems.find({ taste: tasteType });
      // * Log a message indicating that the data was fetched successfully
      console.log(`data from MenuItems of taste type ${tasteType} is fatcehed`)
      // * Send a successful response back to the client with the fetched data
      res.status(200).json(response);
    }
    else {
      // * If the tasteType is not valid, send a 404 error response with a message
      res.status(404).json({ error: "INVALID taste TYPE" });
    }
  } catch (error) {
    // * Log any errors to the console for debugging purposes
    console.log(error);
    // * Send an error response back to the client with a status code 500 and an error message
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})


// *Define the PUT route to update a menu's data by their ID at endpoint /menu/:id 
router.put('/:id', async (req, res) => {
  try {
    //* Extract the menu's ID from the URL parameters
    const menuId = req.params.id;
    //* Extract the data to be updated from the request body
    const menuToBeUpdated = req.body;
    //* Find the menu by ID and update their data with the new data
    //* 'new: true' option returns the updated document
    //* 'runValidators: true' option runs validation on the updated data
    const updatedMenuData = await MenuItems.findByIdAndUpdate(menuId, menuToBeUpdated, {
      new: true,
      runValidators: true
    })
    //* If no menu is found with the given ID, send a 404 response
    if (!updatedMenuData) {
      //* Send the updated person's data as a JSON response with a 200 status code
      res.status(404).json({ error: 'Menu not found' })
    }
    console.log(`Menu data of ID : ${menuId} is updated`);
    //* Send the updated menu's data as a JSON response with a 200 status code
    res.status(200).json(updatedMenuData);
  } catch (error) {
    {
      //* Log any errors that occur and send a 500 response
      console.log(error);
      res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
  }
})


// *Define the DELETE route to delete a menu's data by their ID at endpoint /person/:id
router.delete('/:id', async (req, res) => {
  try {
    //* Extract the menu's ID from the URL parameters
    const menuId = req.params.id;
    //* Extract the data to be deleted from the req.body
    const dataToBeDeleted = await MenuItems.findByIdAndDelete(menuId);
    //* If no menu is found with the given ID, send a 404 response
    if (!dataToBeDeleted) {
      return res.status(404).json({ error: 'Person not found' });
    }
    //* Log a message indicating that the menu's data was deleted
    console.log(`Menu data of ID : ${menuId} is deleted`);
    //* Send the JSON response with a 200 status code and message "Menu deleted successfully"
    res.status(200).json({ message: "Menu deleted successfully" })

  } catch (error) {
    //* Log any errors that occur and send a 500 response
    console.log(error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
})

// * export router
module.exports = router;