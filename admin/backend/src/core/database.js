const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error Connecting to MongoDB', error);
    process.exit(1);
  });
};

module.exports = { connectDatabase };