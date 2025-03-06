import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import cycleService from '../services/cycleService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme, alpha } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CycleChart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [cycles, setCycles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchCycles = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError('');
        const data = await cycleService.getCycles();
        if (Array.isArray(data) && data.length > 0) {
          setCycles(data);
        } else {
          setError('No cycle data available');
        }
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/login');
        } else {
          setError('Failed to fetch cycle data');
          console.error('Error fetching cycles:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCycles();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading chart data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!cycles.length) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No cycle data available</Typography>
      </Box>
    );
  }

  const chartData = {
    labels: cycles.map(cycle => 
      new Date(cycle.startDate).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Cycle Length (days)',
        data: cycles.map(cycle => cycle.cycleLength).reverse(),
        borderColor: '#FF69B4',
        backgroundColor: alpha('#FF69B4', 0.1),
        borderWidth: 3,
        pointBackgroundColor: '#FF69B4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#FF69B4',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: alpha(theme.palette.primary.main, 0.2),
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `Cycle Length: ${context.parsed.y} days`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
          padding: 8,
        },
        title: {
          display: true,
          text: 'Days',
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
            weight: 500,
          },
          padding: { top: 8, bottom: 8 }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
          padding: 8,
        },
        title: {
          display: true,
          text: 'Start Date',
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
            weight: 500,
          },
          padding: { top: 8, bottom: 8 }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      height: 300,
      width: '100%',
      '& canvas': {
        width: '100% !important',
        height: '100% !important'
      }
    }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', width: '100%' }}>
        <Line 
          options={options} 
          data={chartData}
        />
      </Box>
    </Box>
  );
};

export default CycleChart; 