import jwt from "jsonwebtoken";
import { Users } from "../models/User.js"; // Adjust the path as needed

 // Use environment variable for secret

// Middleware to check if the user is authorized

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt
  console.log("Hello")
  // chec json wev token exitst & is verified
  if(token){
      // we are going to use jwt.verify method to check the token
      jwt.verify(token, 'mynameisrifat', (err, decodedToken) => {
          if(err) { // if there is any error found then redirect the user to login page
              console.log(err.message)
              res.status(401).json({ error: 'Unauthorized' });
          }else{
              console.log(decodedToken);
              req.userId = decodedToken.id;
              next()
          }
      } )
  }
  else{
      res.status(401).json({ error: 'Unauthorized' });
  }
};


// Middleware to check and attach the user to the request
const checkUser = async (req, res, next) => {

  const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, 'mynameisrifat', async (err, decodedToken) => {
        if (err) {
          console.error(err);
          res.status(401).json({ error: 'Unauthorized' });
        } else {
          console.log("checkuser emailL: ", decodedToken.id);
          const userEmail = decodedToken.id;
          try {
            const user = await Users.findOne({ email: userEmail }); 
            if (user) {
              req.user = user; // Attach the user object to the request for further processing
              next(); // Proceed to the next middleware or route handler
            } else {
              res.status(404).json({ error: 'User not found' });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error From CheckUser' });
          }
        }
      });
    } else {
      res.status(401).json({ error: 'Unauthorized from CheckUser' });
    }


  // const checkUser = async (req, res, next) => {
  //   const token = req.cookies.jwt;
  
  //   if (token) {
  //     jwt.verify(token, 'labassist group_1 secret', async (err, decodedToken) => {
  //       if (err) {
  //         console.error(err);
  //         res.status(401).json({ error: 'Unauthorized' });
  //       } else {
  //         const userId = decodedToken.id;
  //         try {
  //           const user = await User.findOne({ id: userId });
  //           if (user) {
  //             req.user = user; // Attach the user object to the request for further processing
  //             next(); // Proceed to the next middleware or route handler
  //           } else {
  //             res.status(404).json({ error: 'User not found' });
  //           }
  //         } catch (error) {
  //           console.error(error);
  //           res.status(500).json({ error: 'Internal Server Error' });
  //         }
  //       }
  //     });
  //   } else {
  //     res.status(401).json({ error: 'Unauthorized' });
  //   }
  // };

};

export default { requireAuth, checkUser };
