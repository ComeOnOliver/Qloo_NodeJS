const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Function to validate required environment variables
function validateEnvVars() {
    if (!process.env.EXTERNAL_API_URL) {
        console.error('EXTERNAL_API_URL not set');
        process.exit(1);
    }
}

// Validate environment variables
validateEnvVars(); // Execute environment variable validation

// Middleware for logging API requests
app.use((req, res, next) => {
    console.log('Request received:', req.path);
    next();
});

const externalApiURL = process.env.EXTERNAL_API_URL;

// Function to fetch data from an external API and send response
async function fetchDataFromApi(url, res) {
    try {
        const response = await axios.get(url);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data", error: error.message });
    }
}

// Endpoint to fetch specific data using the `id` query parameter
app.get('/fetch-data', async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: "No ID provided" });
    }
    fetchDataFromApi(`${externalApiURL}?id=${id}`, res);
});

// Endpoint to fetch all data
app.get('/fetch-all', (req, res) => {
    fetchDataFromApi(externalApiURL, res);
});

// Endpoint to exclude certain IDs from the data
app.get('/fetch-data-exclude', async (req, res) => {
    let { ids } = req.query; // Retrieve IDs from query parameter

    // Data Cleannig - Remove quotation marks and trim whitespace
    ids = ids.replace(/['"]+/g, '').trim();

    if (!ids) {
        return res.status(400).json({ message: "Invalid or missing IDs" });
    }

    // Parse IDs into an array of integers
    const parsedIds = ids.split(',').map(id => parseInt(id, 10));

    try {
        // Fetch all data
        const response = await axios.get(externalApiURL);
        // Filter out data with excluded IDs
        const data = response.data.filter(post => !parsedIds.includes(post.id));

        //  Only return data if there is data after filtering
        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ message: "No data found after excluding given IDs" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error processing data", error: error.message });
    }
});

// Endpoint to transform data
app.get('/transform-data', async (req, res) => {
    try {
        const response = await axios.get(externalApiURL);
        let data = response.data;

        // Add a random UUID field to each item
        data = data.map(item => {
            // Generate a UUID
            const uuid = uuidv4();
            
            // Create a hash of the UUID
            const hash = crypto.createHash('sha256').update(uuid).digest('hex');
            // Return the item with the new hashed field
            return { ...item, hashedUuid: `${hash}` };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error processing data", error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
