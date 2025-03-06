import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Card,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';

const CustomButton = ({ children, ...props }) => (
  <Button
    {...props}
    sx={{
      background: 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      boxShadow: '0 3px 5px 2px rgba(255, 105, 180, .3)',
      '&:hover': {
        background: 'linear-gradient(45deg, #FFB6C1 30%, #FF69B4 90%)',
      },
    }}
  >
    {children}
  </Button>
);

const CustomCard = ({ children, ...props }) => (
  <Card
    {...props}
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      boxShadow: '0 4px 8px rgba(255, 105, 180, 0.1)',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    }}
  >
    {children}
  </Card>
);

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }}
  >
    <CircularProgress
      sx={{
        color: '#FF69B4',
      }}
    />
  </Box>
);

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    // Set initial profile data from user
    setProfile(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      dateOfBirth: user.dateOfBirth || ''
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      console.log('Starting profile update...');
      
      // Update user profile in localStorage and backend
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('User session expired. Please log in again.');
      }

      try {
        // Update profile in backend
        await authService.updateProfile({
          name: profile.name,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth
        });

        // Update local storage
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
          dateOfBirth: profile.dateOfBirth
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Profile updated successfully');

        // Handle password change separately if password fields are filled
        if (profile.currentPassword || profile.newPassword || profile.confirmPassword) {
          if (!profile.currentPassword || !profile.newPassword || !profile.confirmPassword) {
            throw new Error('All password fields must be filled to change password');
          }
          if (profile.newPassword !== profile.confirmPassword) {
            throw new Error('New passwords do not match. Please check and try again.');
          }
          if (profile.newPassword.length < 6) {
            throw new Error('New password must be at least 6 characters long');
          }

          try {
            await authService.updatePassword(profile.currentPassword, profile.newPassword);
            // Clear password fields after successful update
            setProfile(prev => ({
              ...prev,
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            }));
          } catch (passwordError) {
            console.error('Password update failed:', passwordError);
            throw passwordError;
          }
        }

        setSuccess(true);
      } catch (updateError) {
        console.error('Profile update failed:', updateError);
        throw new Error(updateError.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      
      // If the error is about authentication, redirect to login
      if (err.message.includes('log in again')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mb: 4,
          position: 'relative'
        }}>
          <Box
            sx={{
              position: 'relative',
              mb: 2
            }}
          >
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: 'primary.main',
                fontSize: '3rem',
                border: `4px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                p: 1,
                boxShadow: 2
              }}
            >
              <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
              textAlign: 'center'
            }}
          >
            Profile Settings
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: '80%' }}
          >
            Manage your account settings and preferences
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
              }}
            >
              Profile updated successfully!
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                color: 'primary.main'
              }}>
                <LockIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Change Password
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={profile.currentPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Required only if changing password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={profile.newPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Leave empty to keep current password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={profile.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Leave empty to keep current password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 