const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5001;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Your MongoDB connection string
const uri = "mongodb+srv://ymalegao:hackathon@major-class.bcgywbx.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

// Variable to hold the database client
let dbClient;

// Route for testing if the server is running
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API endpoint to get classes by major name
app.get('/api/majors/:name', async (req, res) => {
    try {
        // Connect to the client if not already connected
        if (!dbClient) {
            dbClient = await client.connect();
        }

        const database = dbClient.db('Majors');
        const collection = database.collection('classes');

        // Decode and trim the name parameter
        const name = decodeURIComponent(req.params.name.trim());

        console.log("Requested Major Name:", name);
        const major = await collection.findOne({ name: name });

        if (major) {
            res.json(major.requirements);
        } else {
            res.status(404).send('Major not found');
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send('Server error: ' + error.message);
    }
});

// Start the server and connect to the database
app.listen(port, async () => {
    try {
        dbClient = await client.connect();
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
});
