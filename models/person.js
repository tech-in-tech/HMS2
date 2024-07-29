//* Import the mongoose library
const mongoose = require('mongoose');

// * import bcrypt to hash the password and then save it to the database
const bcrypt = require('bcrypt')
//* Define a schema for the 'Person' collection
const personScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
  },
  work: {
    type: String,
    enum: ['chef', 'waiter', 'manager'],
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
  },
  salary: {
    type: Number,
    required: true
  },
  username: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  }
})


// Pre-save hook to hash the password before saving a new user or updating an existing user's password
personScheme.pre('save',async function(next){
  const person = this;    // Reference to the current person document

  // If the password field hasn't been modified, skip hashing and proceed to the next middleware
  if(!person.isModified('password')) return next();
  try {
    // Generate a salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(person.password,salt);
    // Replace the plain password with the hashed password
    person.password = hashedPassword;
    // Proceed to the next middleware
    next();
  } catch (error) {
    // Pass any errors to the next middleware
    return next(error);
  }
})


// Method to compare a candidate password with the stored hashed password
personScheme.methods.comparePassword = async function(candidatePassword){
  try {
    // Compare the candidate password with the stored hashed password
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    // Return true if passwords match, false otherwise
    return isMatch
  } catch (error) {
    // Throw any errors encountered during comparison
    throw error;
  }
}

//* Create a model using the schema and name it 'Person'
const Person = mongoose.model('Person', personScheme);
//* Export the model so it can be used in other parts of the application
module.exports = Person;