const bcrypt = require('bcrypt');
const User = require('../config/mongose'); // Assuming the User model is defined in models/user.js
const saltRounds = 10; 

// Render the home page
const defultCon = async(req, res) => {
  console.log("defcontroller");
  const userId = req.cookies.userId;

  if (!userId) {
    // If no userId cookie, render the signup page
    console.log("First-time visitor. Showing signup page.");
    return res.render('singup');
  } else {
    const user = await User.findById(userId);
    if (user) {
      console.log("Returning user. Showing home page.");
      // Pass the user's name to the index page
      return res.render('index', { userName: user.name });
    }
  }

  res.render("index", { userName: null });
};


// Render the signup form
const SingupForm = (req, res) => {
  console.log("SingupForm");
  res.render("singup");
};


const handleSignup = async (req, res) => {
  const { name, email, password, conf_password } = req.body;

  // Check if password and confirm password match
  if (password !== conf_password) {
    return res.status(400).send("Passwords do not match");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });


    await newUser.save();

    res.cookie('userId', newUser._id.toString(), { maxAge: 30 * 24 * 60 * 60 * 1000 }); // Cookie lasts 30 days
    console.log("User signed up. Redirecting to login.");
    
   res.redirect('/login');
  } catch (error) {

    // Handle duplicate email errors (Mongoose unique validation)
    if (error.code === 11000) {
      return res.status(400).send("Email is already registered");
    }

  }
};

module.exports = { handleSignup };


// Render the login form
const LoginForm = (req, res) => {
  res.render('login');
};

// Handle login form submission
const handleLogin = async (req, res) => {

  const { email, password } = req.body;

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

const handleLogout = (req, res) => {
  // res.clearCookie('userId'); // Clear the userId cookie
  console.log("User logged out. Redirecting to login.");
  res.redirect('/login'); // Redirect to the login page
};

module.exports = { defultCon, SingupForm, handleSignup, LoginForm, handleLogin, handleLogout };
