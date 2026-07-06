const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow your frontend to talk to your backend
app.use(express.json());

const FIVE_SIM_TOKEN = "EyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9..."; // Keep your key safe here!

// Dynamic proxy route handler
app.all('/api/5sim/*', async (req, res) => {
    // Extract the exact endpoint being targeted
    const endpoint = req.params[0]; 
    const url = `https://5sim.net/v1/${endpoint}`;

    try {
        const response = await axios({
            method: req.method,
            url: url,
            headers: {
                'Authorization': `Bearer ${FIVE_SIM_TOKEN}`,
                'Accept': 'application/json'
            },
            data: req.body
        });
        res.json(response.data);
    } catch (error) {
        const statusCode = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : "Internal Server Error";
        res.status(statusCode).json(errorData);
    }
});

app.listen(3000, () => console.log('Secure API Proxy running on port 3000'));
