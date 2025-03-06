import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Avatar,
  CircularProgress,
  Container
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import authService from '../services/authService';
import ChatIcon from '@mui/icons-material/Chat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [stoppingReminder, setStoppingReminder] = useState(false);
  const user = authService.getCurrentUser();

  useEffect(() => {
    checkActiveReminders();
  }, []);

  const checkActiveReminders = async () => {
    try {
      const response = await fetch('/api/reminders/check-reminder');
      const data = await response.json();
      if (data.active) {
        setReminderSet(true);
        setReminderEmail(data.email);
      }
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
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

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Track Cycle', icon: <CalendarMonthIcon />, path: '/cycle-tracking' },
    { label: 'Track Discharge', icon: <AssessmentIcon />, path: '/discharge-tracking' },
    { label: 'Luna', icon: <ChatIcon />, path: '/chat' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: location.pathname === '/dashboard' ? 'transparent' : alpha('#800080', 0.95),
        backdropFilter: location.pathname === '/dashboard' ? 'blur(8px)' : 'none',
        borderBottom: `2px solid ${alpha('#800080', 0.3)}`,
        boxShadow: `0 4px 30px ${alpha('#800080', 0.1)}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: location.pathname === '/dashboard' ? alpha('#800080', 0.1) : alpha('#800080', 0.98),
          borderBottom: `2px solid ${alpha('#800080', 0.5)}`,
          boxShadow: `0 4px 30px ${alpha('#800080', 0.2)}`
        }
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '"Orbitron", "Roboto", sans-serif',
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              textShadow: `0 0 10px ${alpha('#800080', 0.5)}`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              '&:hover': {
                transform: 'scale(1.05)',
                textShadow: `0 0 20px ${alpha('#800080', 0.8)}`,
                '&::after': {
                  width: '100%',
                  opacity: 1
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #800080, #FF1493)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0
              }
            }}
          >
            FEMORA
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item, index) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'block',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    color: '#FF1493',
                    '&::before': {
                      transform: 'scaleX(1)',
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #800080, #FF1493)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {reminderSet && (
              <Button
                onClick={handleStopReminder}
                disabled={stoppingReminder}
                sx={{
                  color: 'white',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    color: '#FF1493',
                    '&::before': {
                      transform: 'scaleX(1)',
                      opacity: 1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #800080, #FF1493)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0
                  }
                }}
              >
                {stoppingReminder ? 'Stopping...' : 'Stop Reminders'}
              </Button>
            )}

            <IconButton
              onClick={handleMenu}
              sx={{ 
                color: 'white',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                  backgroundColor: alpha('#800080', 0.2),
                  boxShadow: `0 0 20px ${alpha('#800080', 0.3)}`
                }
              }}
            >
              <Avatar 
                alt={user?.name || "User"} 
                src={user?.avatar} 
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: `2px solid ${alpha('#800080', 0.5)}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: '#FF1493',
                    boxShadow: `0 0 20px ${alpha('#FF1493', 0.5)}`
                  }
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* User Menu Popup */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 200 }}
      >
        <MenuItem 
          onClick={handleProfile}
          sx={{
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          Profile
        </MenuItem>
        <MenuItem 
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar; 