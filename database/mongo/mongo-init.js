// Initiate MongoDB Connection and Load Models
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Check Environment Variables
if (!process.env.MONGO_USER || !process.env.MONGO_PASS) {
  console.error('Error: Missing MONGO_USER or MONGO_PASS in .env');
  process.exit(1);
}

// Variables
const mongoType = process.env.MONGO_TYPE || 'mongodb';
const mongoURL = process.env.MONGO_URL || 'localhost:27017';
const dbName = process.env.MONGO_DB || 'sandbox_db';
const dbUser = encodeURIComponent(process.env.MONGO_USER);
const dbPass = encodeURIComponent(process.env.MONGO_PASS);

// Functions
async function createUser() {
  const dbURI = `${mongoType}://${mongoURL}`;
  // const client = new MongoClient(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const client = new MongoClient(dbURI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const adminDb = client.db('sandbox_db');

    const users = await adminDb.command({ usersInfo: dbUser });
    if (users.users.length > 0) {
      console.log('User Already Exists:', dbUser);
      return;
    }

    const result = await adminDb.command({
      createUser: dbUser,
      pwd: dbPass,
      roles: [{ role: 'readWrite', db: dbName }],
    });
    console.log('User Created:', result);
  } catch (error) {
    console.error('Error Creating User:', error);
  } finally {
    await client.close();
  }
}

async function connectWithNewUser() {
  const dbURI = `${mongoType}://${dbUser}:${dbPass}@${mongoURL}/${dbName}`;
  // await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoose.connect(dbURI);
  console.log('Connected to MongoDB with New User');
  mongoose.connection.on('connected', () => {
    console.log('Mongoose Connected to MongoDB');
  });
}

async function createCollections() {
  const modelsPath = path.join(__dirname, '../models');
  const files = fs.readdirSync(modelsPath);

  if (!files || files.length === 0) {
    console.log('Error: No Models Found');
  } else {
    for (const file of files) {
      if (file.endsWith('.js')) {
        const model = require(path.join(modelsPath, file));
        console.log('-> Collection Created:', model.collection.name);
        await model.createIndexes();
      }
    }
  }
}

async function run() {
  try {
    await createUser();
    await connectWithNewUser();
    await createCollections();
    console.log('All Tasks Completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();