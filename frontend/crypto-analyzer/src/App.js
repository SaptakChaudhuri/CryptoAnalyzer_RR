import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { color } from 'chart.js/helpers';

const App = () => {
    const [candlestickData, setCandlestickData] = useState([]);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {
        fetchCandlestickData();
        const interval = setInterval(fetchCandlestickData, 180000);  // Fetch data every 3 minutes
        return () => clearInterval(interval);
    }, []);

    const fetchCandlestickData = async () => {
        const response = await axios.get('http://localhost:5000/api/bitcoin');
        setCandlestickData(response.data);
    };

    const predictPrice = async () => {
        const response = await axios.post('http://localhost:5000/api/predict', candlestickData);
        setPrediction(response.data);
    };

    const seriesData = candlestickData.map(data => ({
        x: new Date(data.time),  // Ensure the time is a valid JavaScript Date object
        y: [data.open, data.high, data.low, data.close]
    }));

    return (
        <div style={{ 
            backgroundColor: 'black', 
            color: 'white', 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            
            justifyContent: 'center', 
            padding: '20px' 
        }}>
            <h1  >
                Live Bitcoin Price Prediction <br/> using Ridge Regression Model
            </h1>
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <Chart 
                    options={{
                        chart: { 
                            type: 'candlestick',
                            background: '#000000' 
                        },
                        xaxis: {
                            type: 'datetime',  // Ensures that the x-axis interprets the values as timestamps
                            labels: {
                                style: { colors: '#ffffff' },
                                formatter: function (value) {
                                    return new Date(value).toLocaleString(); // Format time to readable date string
                                }
                            }
                        },
                        yaxis: {
                            labels: {
                                style: { colors: '#ffffff' }
                            }
                        },
                        title: { 
                            text: 'Live 3-Minute Bitcoin Data',
                            style: { color: '#ffffff' }
                        }
                    }}
                    series={[{ data: seriesData }]}
                    type="candlestick"
                    style={{color: 'black'}}
                    // style="color: black"
                    height={350}
                />
            </div>
            <button 
                onClick={predictPrice} 
              
            >
                Predict Future Price
            </button>
            {prediction && (
                <div style={{ 
                    textAlign: 'center', 
                    marginTop: '20px' 
                }}>
                    <h2>Predicted Price: ${prediction.predicted_price.toFixed(2)}</h2>
                    <h3>Model Accuracy: {prediction.accuracy.toFixed(2)}%</h3>
                </div>
            )}
        </div>
    );
};

export default App;