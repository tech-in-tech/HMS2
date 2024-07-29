// * Inport passport and passport local strategy
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;



//* Import person data model to get username and password for the authentication
const Person = require('./models/person')



// * Creating authentication using local strategy
passport.use(new localStrategy(async (USERNAME,PASSWORD,done)=>{
  try {
    // Log the received credentials (username and password)
    console.log("Receved cridentials : ",USERNAME,PASSWORD);
    // Find the user in the database by username
    const user = await Person.findOne({username:USERNAME});
    // If user is not found, authentication fails
    if(!user){
      return done(null,false,{message:"Incorrect username"});
    }
    // Check if the password matches 
    // comparePassword function is define in person.js 
    const pass = await user.comparePassword(PASSWORD);
    // If the password is correct, authentication succeeds
    if(pass){
      return done(null,user);
    }else{
      // If the password is incorrect, authentication fails
      return done(null,false,{message:"Incorrect Password"});
    }
    
  } catch (error) {
    // If there's an error, pass it to the done function
    return done(error);
  }
}))

module.exports = passport
