//* Import the mongoose library
const mongoose = require('mongoose');
//* Define a schema for the 'menuItems' collection
const menuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    require:true
  },
  taste: {
    type: String,
    enum: ['sweet', 'spicy', 'sour'],
    required: true
  },
  is_drink: {
    type: Boolean,
    default:false
  },
  ingredients: {
    type: [String],
    default:[]
  },
  num_sales: {
    type: Number,
    default:0
  }
 
})


//* Create a model using the schema and name it 'Person'
const MenuItems = mongoose.model('MenuItems', menuItemsSchema);
//* Export the model so it can be used in other parts of the application
module.exports = MenuItems;







