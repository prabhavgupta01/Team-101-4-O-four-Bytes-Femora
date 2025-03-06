import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Fade,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from '@mui/material';
import { Close as CloseIcon, Spa as SpaIcon, Star as StarIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ReliefGame = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [elements, setElements] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [showVictory, setShowVictory] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setGameStarted(false);
      setShowVictory(true);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setGameStarted(true);
    setCombo(0);
    generateElements();
  };

  const generateElements = () => {
    const newElements = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 30 + 20,
      speed: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
      type: Math.random() > 0.5 ? 'flower' : 'star',
      color: Math.random() > 0.5 ? theme.palette.primary.main : theme.palette.secondary.main
    }));
    setElements(newElements);
  };

  const handleElementClick = (id) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 1000) {
      setCombo(prev => prev + 1);
      setMessage(`Combo x${combo + 1}!`);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1000);
    } else {
      setCombo(1);
    }
    
    setLastClickTime(currentTime);
    setScore(prev => prev + (10 * (combo + 1)));
    setElements(prev => prev.filter(el => el.id !== id));
    
    if (elements.length <= 1) {
      generateElements();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVictoryMessage = (score) => {
    if (score >= 500) return "You're a true queen! Your strength and grace are absolutely magical! 👑✨";
    if (score >= 300) return "You're shining like a princess! Your inner beauty radiates through everything! 🌟";
    return "You're a star! Every moment with you is filled with wonder and joy! 💫";
  };

  return (
    <Container maxWidth={false} sx={{ 
      minHeight: '100vh',
      pt: 12,
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background particles */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: alpha(theme.palette.primary.main, 0.2),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: 'float 10s ease-in-out infinite',
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </Box>

      {/* Close button */}
      <IconButton
        onClick={() => navigate('/dashboard')}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.1)
          }
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        pt: 4,
        pb: 8,
        position: 'relative',
        zIndex: 1
      }}>
        <Typography variant="h3" gutterBottom sx={{ 
          fontWeight: 700,
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: 4,
          textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`
        }}>
          Period Pain Relief Game
        </Typography>

        {!gameStarted ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxWidth: 600, 
              width: '100%',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}
          >
            <Typography variant="h6" gutterBottom>
              Welcome to the Relief Game!
            </Typography>
            <Typography paragraph>
              Take a 1-minute break to focus on something positive and relaxing.
              Click on the floating elements to collect points while taking deep breaths.
              Build combos for bonus points!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startGame}
              sx={{ 
                mt: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }}
            >
              Start Game
            </Button>
          </Paper>
        ) : (
          <Box sx={{ 
            position: 'relative',
            width: '100%',
            height: '70vh',
            maxWidth: 800,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[10],
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            {/* Game stats */}
            <Box sx={{ 
              position: 'absolute',
              top: 16,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              zIndex: 1
            }}>
              <Typography variant="h6" sx={{ 
                color: theme.palette.primary.main,
                textShadow: `0 1px 2px ${alpha(theme.palette.primary.main, 0.3)}`
              }}>
                Score: {score}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: theme.palette.secondary.main,
                textShadow: `0 1px 2px ${alpha(theme.palette.secondary.main, 0.3)}`
              }}>
                Time: {formatTime(timeLeft)}
              </Typography>
            </Box>

            {/* Combo counter */}
            {combo > 0 && (
              <Typography 
                variant="h5" 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.5)}`,
                  animation: 'pulse 0.5s ease-in-out'
                }}
              >
                Combo x{combo}!
              </Typography>
            )}

            {/* Game elements */}
            {elements.map(element => (
              <Box
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                sx={{
                  position: 'absolute',
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  width: element.size,
                  height: element.size,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: `rotate(${element.rotation}deg)`,
                  animation: 'float 3s ease-in-out infinite',
                  '&:hover': {
                    transform: `rotate(${element.rotation + 45}deg) scale(1.1)`,
                  }
                }}
              >
                {element.type === 'flower' ? (
                  <SpaIcon sx={{ 
                    fontSize: element.size,
                    color: element.color,
                    filter: `drop-shadow(0 2px 4px ${alpha(element.color, 0.5)})`
                  }} />
                ) : (
                  <StarIcon sx={{ 
                    fontSize: element.size,
                    color: element.color,
                    filter: `drop-shadow(0 2px 4px ${alpha(element.color, 0.5)})`
                  }} />
                )}
              </Box>
            ))}

            {/* Pause/Resume button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                }
              }}
            >
              {isPlaying ? 'Pause' : 'Resume'}
            </Button>
          </Box>
        )}

        {/* Game over message */}
        <Fade in={showMessage}>
          <Typography 
            variant="h4" 
            sx={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.primary.main,
              fontWeight: 700,
              textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.5)}`,
              zIndex: 1000
            }}
          >
            {message}
          </Typography>
        </Fade>
      </Box>

      {/* Victory Dialog */}
      <Dialog 
        open={showVictory} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 3,
            animation: 'float 3s ease-in-out infinite'
          }}>
            <TrophyIcon sx={{ 
              fontSize: 80, 
              color: theme.palette.primary.main,
              filter: `drop-shadow(0 2px 4px ${alpha(theme.palette.primary.main, 0.5)})`
            }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main,
            textShadow: `0 2px 4px ${alpha(theme.palette.primary.main, 0.3)}`
          }}>
            Amazing Job! 🎉
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ 
            color: theme.palette.primary.main,
            mb: 2,
            fontWeight: 600
          }}>
            Your Score: {score}
          </Typography>
          <Typography variant="h6" sx={{ 
            color: theme.palette.primary.dark,
            mb: 3,
            fontStyle: 'italic',
            fontWeight: 500
          }}>
            {getVictoryMessage(score)}
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 3,
            color: theme.palette.text.primary,
            fontWeight: 500
          }}>
            Like a princess conquering her kingdom, you're destined for greatness in everything you do.
            Your spirit is as bright as the stars! ✨👑
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowVictory(false);
              startGame();
            }}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              }
            }}
          >
            Play Again
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>
    </Container>
  );
};

export default ReliefGame; 