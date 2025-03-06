import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StopIcon from '@mui/icons-material/Stop';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import cycleService from '../services/cycleService';
import authService from '../services/authService';
import CycleChart from '../components/CycleChart';
import DischargeChart from '../components/DischargeChart';
import HealthInsights from '../components/HealthInsights';
import LunaComfort from '../components/LunaComfort';
import PCOSTracker from '../components/PCOSTracker';
import shadows from '@mui/material/styles/shadows';
import { CalendarMonth as CalendarIcon, LocalHospital as HospitalIcon, Insights as InsightsIcon } from '@mui/icons-material';
import { format, addDays } from 'date-fns';
import ReliefGame from '../components/ReliefGame';
import { Spa as SpaIcon } from '@mui/icons-material';
import { PlayArrow } from '@mui/icons-material';

const symptomCures = {
  cramps: {
    title: "Menstrual Cramps Relief",
    remedies: [
      "Apply a heating pad or hot water bottle to your lower abdomen",
      "Take over-the-counter pain relievers like ibuprofen or acetaminophen",
      "Practice gentle stretching or yoga",
      "Stay hydrated and drink warm herbal teas",
      "Try relaxation techniques like deep breathing"
    ]
  },
  fatigue: {
    title: "Period Fatigue Management",
    remedies: [
      "Get adequate sleep and rest",
      "Stay hydrated and eat iron-rich foods",
      "Take short naps when possible",
      "Exercise moderately to boost energy",
      "Consider taking iron supplements if recommended by your doctor"
    ]
  },
  headache: {
    title: "Period Headache Relief",
    remedies: [
      "Stay hydrated and avoid caffeine",
      "Apply cold or warm compresses to your head",
      "Take over-the-counter pain relievers",
      "Practice stress management techniques",
      "Get regular sleep and maintain a consistent schedule"
    ]
  }
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderSet, setReminderSet] = useState(false);
  const [stoppingReminder, setStoppingReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(15);
  const [showLunaComfort, setShowLunaComfort] = React.useState(false);
  const [showPCOSChecker, setShowPCOSChecker] = React.useState(false);
  const [showReliefGame, setShowReliefGame] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [openSymptomModal, setOpenSymptomModal] = useState(false);

  const checkActiveReminders = async () => {
    try {
      const response = await fetch('/api/reminders/check-reminder');
      const data = await response.json();
      if (data.active) {
        setReminderSet(true);
        setReminderEmail(data.email);
        setReminderInterval(data.interval);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
    checkActiveReminders();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cycleService.getCycleStats();
      console.log('Received stats data:', data);
      setStats(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        navigate('/login');
      } else {
        setError('Failed to fetch cycle statistics. Please try again later.');
        console.error('Error fetching stats:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStopReminder = async () => {
    if (!reminderEmail) {
      alert('No active reminders found.');
      return;
    }

    setStoppingReminder(true);
    try {
      const response = await fetch('/api/reminders/stop-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: reminderEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReminderSet(false);
        setReminderEmail('');
        alert('Reminders stopped successfully!');
      } else {
        alert(data.error || 'Failed to stop reminder. Please try again.');
      }
    } catch (error) {
      console.error('Error stopping reminder:', error);
      alert('Failed to stop reminder. Please check your connection and try again.');
    } finally {
      setStoppingReminder(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not available';
      console.log('Formatting date:', dateString);
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const calculateExpectedDate = () => {
    try {
      if (!stats?.lastCycleEnd) return 'Not available';
      console.log('Calculating expected date with last cycle end:', stats.lastCycleEnd);
      
      const lastDate = new Date(stats.lastCycleEnd);
      if (isNaN(lastDate.getTime())) return 'Invalid date';
      
      // Generate random number between 28 and 30
      const randomDays = Math.floor(Math.random() * 3) + 28; // This will give 28, 29, or 30
      const expectedDate = addDays(lastDate, randomDays);
      return format(expectedDate, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error calculating expected date:', error);
      return 'Not available';
    }
  };

  const handleSymptomClick = (symptom) => {
    setSelectedSymptom(symptom);
    setOpenSymptomModal(true);
  };

  const handleCloseModal = () => {
    setOpenSymptomModal(false);
    setSelectedSymptom(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 12,
      mb: 4,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #0A0A1F, #1A1A3A)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        zIndex: -1
      },
      '@keyframes gradient': {
        '0%': {
          backgroundPosition: '0% 50%'
        },
        '50%': {
          backgroundPosition: '100% 50%'
        },
        '100%': {
          backgroundPosition: '0% 50%'
        }
      },
      '@keyframes floatStar': {
        '0%': {
          transform: 'translate(0, 0) rotate(0deg)',
          opacity: 0.8
        },
        '25%': {
          transform: 'translate(30px, -30px) rotate(90deg)',
          opacity: 1
        },
        '50%': {
          transform: 'translate(0, -60px) rotate(180deg)',
          opacity: 0.8
        },
        '75%': {
          transform: 'translate(-30px, -30px) rotate(270deg)',
          opacity: 1
        },
        '100%': {
          transform: 'translate(0, 0) rotate(360deg)',
          opacity: 0.8
        }
      }
    }}>
      {/* Starry Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, #0A0A1F, #1A1A3A)',
          '& > div': {
            position: 'absolute',
            borderRadius: '50%',
            filter: 'blur(30px)',
            opacity: 0.9,
            animation: 'floatStar 20s ease-in-out infinite'
          }
        }}
      >
        {/* Large Stars */}
        <Box
          sx={{
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle at center, ${alpha('#8B0000', 0.7)}, transparent 70%)`,
            top: '5%',
            left: '5%',
            animationDelay: '0s',
            filter: 'blur(40px)'
          }}
        />
        <Box
          sx={{
            width: '450px',
            height: '450px',
            background: `radial-gradient(circle at center, ${alpha('#800080', 0.7)}, transparent 70%)`,
            top: '50%',
            right: '10%',
            animationDelay: '-5s',
            filter: 'blur(40px)'
          }}
        />
        <Box
          sx={{
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle at center, ${alpha('#000080', 0.7)}, transparent 70%)`,
            bottom: '10%',
            left: '20%',
            animationDelay: '-10s',
            filter: 'blur(40px)'
          }}
        />
        <Box
          sx={{
            width: '350px',
            height: '350px',
            background: `radial-gradient(circle at center, ${alpha('#4B0082', 0.7)}, transparent 70%)`,
            top: '20%',
            right: '20%',
            animationDelay: '-15s',
            filter: 'blur(40px)'
          }}
        />

        {/* Small Stars */}
        {[...Array(20)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: `${Math.random() * 100 + 30}px`,
              height: `${Math.random() * 100 + 30}px`,
              background: `radial-gradient(circle at center, ${alpha('#FF1493', 0.5)}, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${-Math.random() * 20}s`,
              filter: 'blur(20px)',
              animation: `floatStar ${Math.random() * 10 + 15}s ease-in-out infinite`
            }}
          />
        ))}

        {/* Twinkling Stars */}
        {[...Array(30)].map((_, index) => (
          <Box
            key={`twinkle-${index}`}
            sx={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: alpha('#FFD700', 0.9),
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 1}s ease-in-out infinite`,
              animationDelay: `${-Math.random() * 3}s`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </Box>

      {/* Add twinkle animation */}
      <Box
        sx={{
          '@keyframes twinkle': {
            '0%, 100%': {
              opacity: 0.2,
              transform: 'scale(1)'
            },
            '50%': {
              opacity: 1,
              transform: 'scale(2)'
            }
          }
        }}
      />

      <Grid container spacing={3}>
        {reminderSet && (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 2, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: alpha('#800080', 0.15),
                border: `2px solid ${alpha('#FF1493', 0.3)}`,
                boxShadow: `0 4px 20px ${alpha('#800080', 0.3)}`,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: `0 8px 30px ${alpha('#800080', 0.25)}`
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <AccessTimeIcon sx={{ 
                  color: '#FF1493',
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.2))',
                  animation: 'pulse 2s infinite'
                }} />
                <Typography sx={{ 
                  fontWeight: 500,
                  color: '#FF1493',
                  textShadow: '0 0 10px rgba(0,0,0,0.1)'
                }}>
                  Active reminders every {reminderInterval} minutes
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={handleStopReminder}
                disabled={stoppingReminder}
                startIcon={stoppingReminder ? <CircularProgress size={20} /> : <StopIcon />}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: alpha('#ef4444', 0.15),
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 15px ${alpha('#ef4444', 0.3)}`
                  }
                }}
              >
                {stoppingReminder ? 'Stopping...' : 'Stop Reminders'}
              </Button>
            </Paper>
          </Grid>
        )}

        {/* Luna's Comfort Check-in */}
        <Grid item xs={12}>
          <Box sx={{ mb: 3 }}>
            <LunaComfort />
          </Box>
        </Grid>

        {/* Welcome Section with Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              background: `linear-gradient(135deg, ${alpha('#800080', 0.98)}, ${alpha('#000000', 0.7)})`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              border: `2px solid ${alpha('#800080', 0.5)}`,
              boxShadow: `0 0 40px ${alpha('#800080', 0.5)}`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.01)',
                boxShadow: `0 0 60px ${alpha('#800080', 0.6)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at top right, ${alpha('#800080', 0.2)} 0%, transparent 70%)`,
                pointerEvents: 'none',
                animation: 'pulse 4s ease-in-out infinite'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(45deg, transparent 0%, ${alpha('#800080', 0.1)} 50%, transparent 100%)`,
                animation: 'shine 3s ease-in-out infinite',
                pointerEvents: 'none'
              }
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  textShadow: `0 0 20px ${alpha('#800080', 0.5)}, 0 0 10px ${alpha('#800080', 0.3)}`,
                  animation: 'fadeIn 0.8s ease-out',
                  letterSpacing: '1px',
                  fontFamily: '"Orbitron", "Roboto", sans-serif'
                }}>
                  Welcome to Femora
                </Typography>
                <Typography variant="subtitle1" sx={{ 
                  mb: 3, 
                  color: 'white',
                  textShadow: '0 0 10px rgba(0,0,0,0.3)',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Your personal menstrual health companion
                </Typography>
              </Box>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchStats}
                  sx={{ 
                    color: '#FF1493',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha('#FF1493', 0.2),
                      transform: 'rotate(180deg) scale(1.2)',
                      boxShadow: `0 0 20px ${alpha('#FF1493', 0.5)}`
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
              {[
                { icon: <CalendarIcon />, text: 'Log Cycle', path: '/cycle-tracking' },
                { icon: <AssessmentIcon />, text: 'Track Discharge', path: '/discharge-tracking' },
                { icon: <ChatIcon />, text: 'Talk to Luna', path: '/chat' },
                { icon: <PersonIcon />, text: 'Profile', path: '/profile' },
                { icon: <HospitalIcon />, text: 'PCOS Check', path: '/pcos-tracker' },
                { icon: <InsightsIcon />, text: 'Insights', path: '/insights' },
                { icon: <SpaIcon />, text: 'Relief Game', path: '/relief-game' }
              ].map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Button
                    variant="contained"
                    color="inherit"
                    fullWidth
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      backgroundColor: alpha('#FF1493', 0.2),
                      backdropFilter: 'blur(8px)',
                      border: `2px solid ${alpha('#FF1493', 0.4)}`,
                      color: 'white',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: alpha('#FF1493', 0.3),
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: `0 0 30px ${alpha('#FF1493', 0.4)}`,
                        borderColor: alpha('#FF1493', 0.6)
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                </Grid>
              ))}
              {reminderSet && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleStopReminder}
                    disabled={stoppingReminder}
                    startIcon={stoppingReminder ? <CircularProgress size={20} /> : <NotificationsOffIcon />}
                    sx={{
                      backgroundColor: alpha('#FF1493', 0.2),
                      backdropFilter: 'blur(8px)',
                      border: `2px solid ${alpha('#FF1493', 0.4)}`,
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 2,
                      mt: 2,
                      letterSpacing: '0.5px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: alpha('#FF1493', 0.3),
                        transform: 'translateY(-3px) scale(1.05)',
                        boxShadow: `0 0 30px ${alpha('#FF1493', 0.4)}`,
                        borderColor: alpha('#FF1493', 0.6)
                      }
                    }}
                  >
                    {stoppingReminder ? 'Stopping Reminders...' : 'Stop Reminders'}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Cycle Statistics Summary */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#8B0000', 0.95)}, ${alpha('#FF1493', 0.95)})`,
              color: 'white',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 8px 30px ${alpha('#8B0000', 0.3)}`
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at top left, rgba(255,255,255,0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              animation: 'fadeIn 0.8s ease-out'
            }}>
              Cycle Statistics
            </Typography>
            {!stats?.hasData ? (
              <Box textAlign="center" py={2}>
                <Typography color="inherit" paragraph sx={{ 
                  opacity: 0.9,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                  No cycle data available yet
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate('/cycle-tracking')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: alpha(theme.palette.common.white, 0.15),
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Start Tracking
                </Button>
              </Box>
            ) : (
              <List>
                {[
                  { primary: 'Last Period', secondary: formatDate(stats.lastCycleEnd) },
                  { primary: 'Next Expected', secondary: calculateExpectedDate() },
                  { primary: 'Last Cycle Length', secondary: `${stats.lastCycleLength || 'Not available'} days` },
                  { primary: 'Average Length', secondary: `${stats.averageLength || 'Not available'} days` },
                  { primary: 'Total Cycles', secondary: stats.totalCycles || 'Not available' }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.white, 0.15),
                        transform: 'translateX(4px) scale(1.02)'
                      }
                    }}>
                      <ListItemText
                        primary={item.primary}
                        secondary={item.secondary}
                        primaryTypographyProps={{ 
                          sx: { 
                            color: 'white',
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          } 
                        }}
                        secondaryTypographyProps={{ 
                          sx: { 
                            color: alpha(theme.palette.common.white, 0.7),
                            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                          } 
                        }}
                      />
                    </ListItem>
                    {index < 4 && <Divider sx={{ borderColor: alpha(theme.palette.common.white, 0.2) }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Cycle Chart */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            background: alpha('#0A0A1F', 0.9),
            backdropFilter: 'blur(8px)',
            border: `2px solid ${alpha('#FF1493', 0.3)}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 30px ${alpha('#800080', 0.2)}`
            }
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: '#FF1493',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Cycle History
              </Typography>
              <Tooltip title="Refresh Chart">
                <IconButton 
                  onClick={fetchStats}
                  sx={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'rotate(180deg) scale(1.1)',
                      backgroundColor: alpha('#800080', 0.1)
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <CycleChart />
            </Box>
          </Paper>
        </Grid>

        {/* Health Insights */}
        <Grid item xs={12}>
          <Box sx={{
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`
            }
          }}>
            <HealthInsights />
          </Box>
        </Grid>

        {/* Discharge Chart */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            background: alpha('#0A0A1F', 0.9),
            backdropFilter: 'blur(8px)',
            border: `2px solid ${alpha('#FF1493', 0.3)}`,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 30px ${alpha('#800080', 0.2)}`
            }
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: '#FF1493',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Discharge Pattern Analysis
              </Typography>
              <Tooltip title="Refresh Chart">
                <IconButton 
                  onClick={fetchStats}
                  sx={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'rotate(180deg) scale(1.1)',
                      backgroundColor: alpha('#800080', 0.1)
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ height: 300, mt: 2 }}>
              <DischargeChart />
            </Box>
          </Paper>
        </Grid>

        {/* Common Symptoms */}
        {stats?.hasData && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              background: alpha('#0A0A1F', 0.9),
              backdropFilter: 'blur(8px)',
              border: `2px solid ${alpha('#FF1493', 0.3)}`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 8px 30px ${alpha('#800080', 0.2)}`
              }
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                fontWeight: 600,
                color: '#FF1493',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Common Symptoms
              </Typography>
              <Grid container spacing={2}>
                {stats.commonSymptoms.map((symptom, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper 
                      onClick={() => handleSymptomClick(symptom)}
                      sx={{ 
                        p: 2,
                        bgcolor: alpha('#800080', 0.1),
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${alpha('#800080', 0.2)}`,
                        '&:hover': {
                          bgcolor: alpha('#800080', 0.15),
                          transform: 'translateY(-2px) scale(1.02)',
                          boxShadow: `0 4px 15px ${alpha('#800080', 0.2)}`
                        }
                      }}
                    >
                      <Typography sx={{ 
                        fontWeight: 500,
                        color: '#FF1493',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        {symptom}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Floating Luna Shortcut */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderRadius: '50%',
          overflow: 'hidden',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: `0 0 30px ${alpha('#800080', 0.5)}`,
            '& .MuiAvatar-root': {
              transform: 'scale(1.1)',
              boxShadow: `0 0 40px ${alpha('#800080', 0.8)}`
            }
          }
        }}
        onClick={() => navigate('/chat')}
      >
        <Avatar 
          sx={{ 
            width: 64,
            height: 64,
            bgcolor: 'transparent',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${alpha('#800080', 0.9)}, ${alpha('#FF1493', 0.7)})`,
              animation: 'rotate 8s linear infinite',
              boxShadow: `0 0 30px ${alpha('#800080', 0.5)}`
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 70% 70%, ${alpha('#FF1493', 0.9)}, ${alpha('#800080', 0.7)})`,
              animation: 'rotate 8s linear infinite reverse',
              opacity: 0.7
            }
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, ${alpha('#800080', 0.95)}, ${alpha('#4B0082', 0.8)})`,
            animation: 'pulse 3s ease-in-out infinite',
            boxShadow: `0 0 40px ${alpha('#800080', 0.6)}`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '20%',
              height: '20%',
              borderRadius: '50%',
              background: alpha(theme.palette.common.white, 0.8),
              filter: 'blur(2px)',
              animation: 'float 4s ease-in-out infinite'
            }
          }}>
            {/* Futuristic L */}
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2rem',
                fontWeight: 700,
                color: theme.palette.common.white,
                textShadow: `0 0 15px ${alpha(theme.palette.common.white, 0.8)}`,
                fontFamily: '"Orbitron", "Roboto", sans-serif',
                letterSpacing: '2px',
                animation: 'glow 2s ease-in-out infinite'
              }}
            >
              L
            </Typography>
          </Box>
        </Avatar>
      </Box>

      {/* Symptom Cure Modal */}
      <Dialog 
        open={openSymptomModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSymptom && symptomCures[selectedSymptom.toLowerCase()]?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Remedies and Relief Tips:
            </Typography>
            <List>
              {selectedSymptom && symptomCures[selectedSymptom.toLowerCase()]?.remedies.map((remedy, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <HealthAndSafetyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={remedy} />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add new animations */}
      <Box
        sx={{
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)'
            },
            '50%': {
              transform: 'scale(1.1)'
            },
            '100%': {
              transform: 'scale(1)'
            }
          }
        }}
      />
    </Container>
  );
};

export default Dashboard; 