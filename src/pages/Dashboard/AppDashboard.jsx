import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { axiosInstance } from '../../api/axiosInstance';

const AppDashboard = () => {
    useEffect(() => {
        // This is where you can fetch data or perform any setup when the component mounts
        axiosInstance.post('http://35.170.201.215:5000/api/getUser')
            .then(response => {
                console.log('Dashboard initialized:', response.data);
            })
            .catch(error => {
                console.error('Error initializing dashboard:', error);
            });
    }, []);
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to AWS Sync Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {/* Card 1 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Total Users</Typography>
                            <Typography variant="h4" color="primary">1,245</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 2 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Revenue</Typography>
                            <Typography variant="h4" color="green">$23,540</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Card 3 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6">New Orders</Typography>
                            <Typography variant="h4" color="secondary">342</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AppDashboard;
