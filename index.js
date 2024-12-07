const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Environment variables
const port = process.env.PORT || 2402;
const mongourl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mydatabase';

// MongoDB Connection
mongoose.connect(mongourl)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Define Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const UserModel = mongoose.model('User', userSchema);

//Get route for getting the data.
app.get('/getUser', async (req, res) => {
  try{
    const users = await UserModel.find();
    res.json(users);
    } catch (err) {
      console.error(err);
  }
});

// POST Route for saving user data
app.post('/postUser', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const user = new UserModel({ name, email, message });
    const savedUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});