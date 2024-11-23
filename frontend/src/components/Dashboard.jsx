import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [writeApiKey, setWriteApiKey] = useState('');

  const fetchApiKey = async () => {
    try {
      const response = await axios.get("http://localhost:5000/profile", {
        withCredentials: true, // Ensure cookies are sent with the request
      });

      setWriteApiKey(response.data.writeApiKey);
      console.log("API Key fetched successfully:", response.data.writeApiKey);
    } catch (error) {
      console.error('Error fetching API Key:', error.response?.data || error.message);
    }
  };

  const handleShowApiKey = () => {
    if (!showApiKey) {
      fetchApiKey(); // Fetch the API key only if it isn't being displayed already
    }
    setShowApiKey(!showApiKey); // Toggle the visibility of the API key
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            IoT Dashboard
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar and Main Content */}
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: '250px',
            bgcolor: '#f5f5f5',
            height: '100vh',
            borderRight: '1px solid #ddd',
            padding: 2,
          }}
          className="sidebar"
        >
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <Button fullWidth sx={{ marginBottom: 2 }} variant="outlined">
            Dashboard
          </Button>
          <Button fullWidth sx={{ marginBottom: 2 }} variant="outlined">
            Sensors
          </Button>
          <Button fullWidth sx={{ marginBottom: 2 }} variant="outlined">
            Settings
          </Button>
          <Button fullWidth sx={{ marginBottom: 2 }} variant="outlined">
            Logs
          </Button>
          {/* Show API Key Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleShowApiKey}
          >
            {showApiKey ? 'Hide API Key' : 'Show API Key'}
          </Button>
        </Box>

        {/* Main Content */}
        <Container sx={{ flexGrow: 1, padding: 4 }} className="main-container">
          <Typography variant="h4" gutterBottom>
            Welcome to your IoT Dashboard
          </Typography>

          {showApiKey && (
            <Card sx={{ marginBottom: 4 }}>
              <CardContent>
                <Typography variant="h6">Your Write API Key</Typography>
                <Typography variant="body1" sx={{ marginTop: 2, wordBreak: 'break-word' }}>
                  {writeApiKey || 'Loading...'}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Placeholder for Sensor Chart */}
          <Box sx={{ marginBottom: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sensor Data (Live Chart)</Typography>
                <Box
                  sx={{
                    height: '300px',
                    bgcolor: '#eaeaea',
                    textAlign: 'center',
                    lineHeight: '300px',
                  }}
                  className="chart-placeholder"
                >
                  Chart Placeholder
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Placeholder for Sensor Summary */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Sensor 1</Typography>
                  <Typography variant="body1">Value: 25°C</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: Active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Sensor 2</Typography>
                  <Typography variant="body1">Value: 60%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: Active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
