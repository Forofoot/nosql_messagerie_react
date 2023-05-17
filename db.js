const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Database Name
const dbName = 'digitalcampus';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the MongoDB server
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

// Get the reference to the database
function getDatabase() {
  return client.db(dbName);
}

module.exports = {
  connect,
  getDatabase,
};