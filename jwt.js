//* Import the jsonwebtoken library
const jwt = require('jsonwebtoken');


//* Define the JWT authentication middleware function
const jwtAuthMiddleware = (req, res, next) => {
  // first check request heder has authorization or not
  const authorization = req.headers.authorization
  if(!authorization) return res.status(401).json({error:"token not found"});


  //* Extract the token from the Authorization header
  //* The token is expected to be in the format "Bearer <token>"
  const token = req.headers.authorization.split(' ')[1];
    //* If no token is found, respond with a 401 Unauthorized status
  if (!token) return res.status(401).json({ error: "UNAUTHORIZED" });
  try {
    //* Try to verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //* If verification successful, attach the decoded payload to the request object
    req.user = decoded

    //* Call the next middleware function in the stack
    next();
  } catch (error) {
    //* Log any error that occurs during token verification
    console.log(error);
     //* Respond with a 401 Unauthorized status if the token is invalid
    res.status(401).json({ error: 'Invalid Token' });
  }
}


// * function to generate JWT token
const generateToken= (userData)=>{
  // *Generate a new JWT token using user data
  return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn:30000});
}


//* Export the middleware function to be used in other parts of the application
module.exports = {jwtAuthMiddleware,generateToken}