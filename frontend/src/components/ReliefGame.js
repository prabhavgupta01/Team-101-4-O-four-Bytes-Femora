import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Pause as PauseIcon, 
  Refresh as RefreshIcon,
  Spa as SpaIcon
} from '@mui/icons-material';

const ReliefGame = () => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [floatingElements, setFloatingElements] = useState([]);
  const gameRef = useRef(null);

  // Create floating elements
  const createFloatingElement = () => {
    const element = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // Random position between 10% and 90%
      y: -20, // Start above the screen
      speed: Math.random() * 2 + 1,
      rotation: Math.random() * 360,
      size: Math.random() * 20 + 10,
      emoji: ['🌸', '✨', '💫', '🌺', '🌼', '🌷'][Math.floor(Math.random() * 6)]
    };
    setFloatingElements(prev => [...prev, element]);
  };

  // Game loop
  useEffect(() => {
    let gameLoop;
    let elementInterval;

    if (isPlaying && timeLeft > 0) {
      // Update time
      gameLoop = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      // Create new elements
      elementInterval = setInterval(createFloatingElement, 2000);

      // Update element positions
      const updateElements = setInterval(() => {
        setFloatingElements(prev => 
          prev.map(element => ({
            ...element,
            y: element.y + element.speed,
            rotation: element.rotation + 1
          })).filter(element => element.y < 100) // Remove elements that fall off screen
        );
      }, 50);

      return () => {
        clearInterval(gameLoop);
        clearInterval(elementInterval);
        clearInterval(updateElements);
      };
    }
  }, [isPlaying, timeLeft]);

  // Handle click on floating elements
  const handleElementClick = (id) => {
    setFloatingElements(prev => prev.filter(element => element.id !== id));
    setScore(prev => prev + 10);
  };

  // Reset game
  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setTimeLeft(300);
    setFloatingElements([]);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpaIcon color="primary" /> Period Pain Relief Game
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="h6">Score: {score}</Typography>
          <Typography variant="h6">Time: {formatTime(timeLeft)}</Typography>
          <IconButton onClick={resetGame} color="primary">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </Box>
      </Box>

      <Box
        ref={gameRef}
        sx={{
          height: '300px',
          position: 'relative',
          background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
      >
        {floatingElements.map(element => (
          <Box
            key={element.id}
            onClick={() => handleElementClick(element.id)}
            sx={{
              position: 'absolute',
              left: `${element.x}%`,
              top: `${element.y}%`,
              transform: `rotate(${element.rotation}deg)`,
              fontSize: `${element.size}px`,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: `rotate(${element.rotation}deg) scale(1.2)`,
                filter: 'brightness(1.2)'
              }
            }}
          >
            {element.emoji}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Click on the floating elements to collect points and distract yourself. 
          Take deep breaths and focus on catching the elements.
        </Typography>
      </Box>
    </Paper>
  );
};

export default ReliefGame; 