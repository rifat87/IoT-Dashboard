import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [writeApiKey, setWriteApiKey] = useState('');
  const [sensorName, setSensorName] = useState('');
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

 // Determine the base URL dynamically
  const baseURL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : `http://${window.location.hostname}:5000`; // Use local IP if not localhost



  // Fetch API Key
  const fetchApiKey = async () => {
    try {
      const response = await axios.get(`${baseURL}/profile`, {
        withCredentials: true,
      });

      setWriteApiKey(response.data.writeApiKey);
      console.log("API Key fetched successfully:", response.data.writeApiKey);
    } catch (error) {
      console.error('Error fetching API Key:', error.response?.data || error.message);
    }
  };

  const handleShowApiKey = () => {
    if (!showApiKey) {
      fetchApiKey();
    }
    setShowApiKey(!showApiKey);
  };

  // Fetch Sensor Data
  const fetchSensorData = async (manualFetch = false) => {
    if (manualFetch) setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/read`, 
        { sensorName }, 
        { withCredentials: true }
      );
      setSensorData(response.data);
      console.log('Sensor data fetched successfully:', response.data);
    } catch (error) {
      console.error(
        'Error fetching sensor data:',
        error.response?.data || error.message
      );
    }
    if (manualFetch) setIsLoading(false);
  };

  // Polling for live updates every 10 seconds
  useEffect(() => {
    if (sensorName) {
      const interval = setInterval(() => fetchSensorData(false), 10000);
      return () => clearInterval(interval);
    }
  }, [sensorName]);

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
          {/* Navigate to Add Sensor */}
          <Button
            fullWidth
            sx={{ marginBottom: 2 }}
            variant="contained"
            color="secondary"
            onClick={() => navigate('/add-sensor')}
          >
            Add Sensor
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

          {/* Sensor Data Section */}
          <Box sx={{ marginBottom: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sensor Data (Live Chart)</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 2,
                  }}
                >
                  <TextField
                    label="Sensor Name"
                    variant="outlined"
                    value={sensorName}
                    onChange={(e) => setSensorName(e.target.value)}
                    sx={{ marginRight: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => fetchSensorData(true)}
                    disabled={!sensorName || isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Fetch Data'}
                  </Button>
                </Box>
                {sensorData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={sensorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(tick) =>
                          new Date(tick).toLocaleTimeString()
                        }
                      />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available. Enter a valid sensor name and fetch data.
                  </Typography>
                )}
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
