const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Create a new user (student or professor)
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if(!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  const userExists = await User.findOne({ email });
  if(userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  if(user){
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

module.exports = { createUser };
