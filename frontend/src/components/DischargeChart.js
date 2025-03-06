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

const DischargeChart = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [discharges, setDischarges] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchDischarges = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        setLoading(true);
        setError('');
        const data = await cycleService.getDischargeHistory();
        if (Array.isArray(data) && data.length > 0) {
          setDischarges(data);
        } else {
          setError('No discharge data available');
        }
      } catch (err) {
        if (err.message === 'Unauthorized') {
          navigate('/login');
        } else {
          setError('Failed to fetch discharge data');
          console.error('Error fetching discharges:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDischarges();
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

  if (!discharges.length) {
    return (
      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>No discharge data available</Typography>
      </Box>
    );
  }

  // Create color mapping for different discharge types
  const colorMap = {
    'watery': '#4A90E2',
    'sticky': '#F5A623',
    'creamy': '#7ED321',
    'egg-white': '#9013FE',
    'thick': '#D0021B'
  };

  const chartData = {
    labels: discharges.map(discharge => 
      new Date(discharge.date).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Consistency',
        data: discharges.map(discharge => {
          // Convert consistency to numeric value for visualization
          const consistencyMap = {
            'watery': 1,
            'sticky': 2,
            'creamy': 3,
            'egg-white': 4,
            'thick': 5
          };
          return consistencyMap[discharge.consistency];
        }).reverse(),
        borderColor: '#4A90E2',
        backgroundColor: alpha('#4A90E2', 0.1),
        borderWidth: 3,
        pointBackgroundColor: discharges.map(discharge => 
          colorMap[discharge.consistency]
        ).reverse(),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: discharges.map(discharge => 
          colorMap[discharge.consistency]
        ).reverse(),
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ]
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
            const discharge = discharges[context.dataIndex];
            return [
              `Consistency: ${discharge.consistency}`,
              `Color: ${discharge.color}`,
              `Amount: ${discharge.amount}`,
              `Odor: ${discharge.odor}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: alpha(theme.palette.divider, 0.1),
          drawBorder: false,
        },
        ticks: {
          stepSize: 1,
          color: theme.palette.text.secondary,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
          padding: 8,
          callback: function(value) {
            const consistencyMap = {
              1: 'Watery',
              2: 'Sticky',
              3: 'Creamy',
              4: 'Egg White',
              5: 'Thick'
            };
            return consistencyMap[value];
          }
        },
        title: {
          display: true,
          text: 'Consistency',
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
          text: 'Date',
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

export default DischargeChart; 