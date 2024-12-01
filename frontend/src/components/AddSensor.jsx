import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddSensor.css'; // Import the CSS file

const AddSensor = () => {
  const [sensorName, setSensorName] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Helper function to get the JWT token from cookies
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  };

   // Determine the base URL dynamically
   const baseURL = window.location.hostname === 'localhost' 
   ? 'http://localhost:5000' 
   : `http://${window.location.hostname}:5000`; // Use local IP if not localhost



  const handleAddSensor = async () => {
    try {
    //   const token = getCookie('jwt'); // Get the token from cookies using the correct cookie name 'jwt'
    //   if (!token) {
    //     console.error('No token found');
    //     return;
    //   }

      const response = await axios.post(
       `${baseURL}/add-sensor`, // Adjust URL if needed
        { sensorName }, {
            withCredentials: true, // Ensure cookies are sent with the request
          }
      );

      if (response.status === 201) {
        console.log('Sensor added successfully:', response.data);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error adding sensor:', error);
    }
  };

  return (
    <Box className="add-sensor-container">
      <Paper elevation={4} className="add-sensor-paper">
        <Typography variant="h4" className="add-sensor-title">
          Add New Sensor
        </Typography>

        <TextField
          label="Sensor Name"
          variant="outlined"
          fullWidth
          className="add-sensor-input"
          value={sensorName}
          onChange={(e) => setSensorName(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          className="add-sensor-button"
          onClick={handleAddSensor}
          disabled={!sensorName.trim()}
        >
          Add Sensor
        </Button>

        {success && (
          <Button
            variant="outlined"
            fullWidth
            className="go-to-dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default AddSensor;
