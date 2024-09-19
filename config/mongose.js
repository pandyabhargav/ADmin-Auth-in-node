const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yourDatabase', {
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
    trim: true    
  },
  email: {
    type: String,
    required: true,  
    unique: true,    
    lowercase: true, 
    trim: true       
  },
  password: {
    type: String,
    required: true  
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
