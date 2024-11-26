const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Fetch real-time data from Binance
app.get('/api/bitcoin', async (req, res) => {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=3m&limit=10');
        const data = response.data.map(entry => ({
            time: entry[0],
            open: parseFloat(entry[1]),
            high: parseFloat(entry[2]),
            low: parseFloat(entry[3]),
            close: parseFloat(entry[4]),
            volume: parseFloat(entry[5])
        }));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from Binance.' });
    }
});

// Route to trigger the Python prediction model
app.post('/api/predict', (req, res) => {
    const trainingData = req.body;

    // Spawn a Python process
    const pythonProcess = spawn('python', ['predict.py']);
    pythonProcess.stdin.write(JSON.stringify(trainingData));
    pythonProcess.stdin.end();

    let result = '';
    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.on('close', () => {
        res.json(JSON.parse(result));
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
