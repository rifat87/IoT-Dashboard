import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Grid, Card, CardContent, Button } from '@mui/material';
import '../styles/Dashboard.css';

const Dashboard = () => {
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
          <Button fullWidth variant="outlined">
            Logs
          </Button>
        </Box>

        {/* Main Content */}
        <Container sx={{ flexGrow: 1, padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to your IoT Dashboard
          </Typography>

          {/* Placeholder for Sensor Chart */}
          <Box sx={{ marginBottom: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sensor Data (Live Chart)</Typography>
                <Box sx={{ height: '300px', bgcolor: '#eaeaea', textAlign: 'center', lineHeight: '300px' }}>
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
