const bcrypt = require('bcrypt');
const User = require('../config/mongose'); // Assuming the User model is defined in models/user.js
const saltRounds = 10; 

// Render the home page
const defultCon = (req, res) => {
  console.log("defcontroller");
  res.render("index");
};

// Render the signup form
const SingupForm = (req, res) => {
  console.log("SingupForm");
  res.render("singup");
};


const handleSignup = async (req, res) => {
  console.log("Handle Signup");

  const { name, email, password, conf_password } = req.body;
console.log(req.body);

  

  // Check if password and confirm password match
  if (password !== conf_password) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

 
    await newUser.save();

    console.log("User created successfully:", newUser);
   res.redirect('/login');
  } catch (error) {
    console.error("Error during signup:", error);

    // Handle duplicate email errors (Mongoose unique validation)
    if (error.code === 11000) {
      return res.status(400).send("Email is already registered");
    }

    res.status(500).send("Error during signup");
  }
};

module.exports = { handleSignup };


// Render the login form
const LoginForm = (req, res) => {
  console.log("LoginForm rendered");
  res.render('login'); // Make sure 'login' is your actual EJS template
};

// Handle login form submission
const handleLogin = async (req, res) => {
  console.log("Handle Login");

  const { email, password } = req.body;
  console.log("Request Body:", req.body);
  
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.redirect('/');
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
};



module.exports = { defultCon, SingupForm, handleSignup, LoginForm, handleLogin };
