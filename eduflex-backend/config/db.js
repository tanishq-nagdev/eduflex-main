const mongoose = require('mongoose');

async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    // useNewUrlParser, useUnifiedTopology not required in latest mongoose
  });
  console.log('MongoDB connected');
}

module.exports = connectDB;
