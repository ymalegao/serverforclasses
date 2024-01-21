// server.js
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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// API endpoint to get classes by major name
app.get('/api/majors/:name', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('Majors');
        const collection = database.collection('classes');

        // Decode and trim the name parameter
        const name = decodeURIComponent(req.params.name.trim());

        console.log(name);
        const major = await collection.findOne({ name: name });
        if (major) {
            res.json(major.prerequisites);
        } else {
            res.status(404).send('Major not found');
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send('Server error: ' + error.message);
    } finally {
        await client.close();
    }
});
