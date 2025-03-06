import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  keyframes,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SpaIcon from '@mui/icons-material/Spa';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import SendIcon from '@mui/icons-material/Send';
import PaperPlaneIcon from '@mui/icons-material/Send';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Checkbox from '@mui/material/Checkbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Add custom animations
const floatUp = keyframes`
  0% {
    transform: translateX(0) translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: translateX(50px) translateY(-10px) rotate(10deg) scale(1.1);
    opacity: 0.9;
  }
  50% {
    transform: translateX(100px) translateY(-20px) rotate(20deg) scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: translateX(150px) translateY(-30px) rotate(30deg) scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: translateX(200px) translateY(-40px) rotate(40deg) scale(0.8);
    opacity: 0;
  }
`;

const explode = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  25% {
    transform: scale(1.2) rotate(90deg);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.2) rotate(270deg);
    opacity: 0.6;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

const sparkle = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const initialQuestion = {
  question: "How are you feeling today?",
  options: ["Great!", "Really down"],
  type: "radio"
};

const comfortActivities = [
  {
    title: "Chat with Luna",
    icon: <ChatIcon />,
    description: "I'm here to listen and support you",
    color: "#FF1493",
    content: {
      type: "chat"
    }
  },
  {
    title: "Self Care Ideas",
    icon: <SpaIcon />,
    description: "Gentle ways to take care of yourself",
    color: "#FF69B4",
    content: {
      type: "list",
      items: [
        {
          text: "Take a warm bath with your favorite bath salts",
          icon: "🛁"
        },
        {
          text: "Apply a heating pad to soothe cramps",
          icon: "🔥"
        },
        {
          text: "Drink some chamomile tea",
          icon: "☕"
        },
        {
          text: "Do gentle stretching exercises",
          icon: "🧘‍♀️"
        },
        {
          text: "Watch your favorite comfort show",
          icon: "📺"
        },
        {
          text: "Have some dark chocolate",
          icon: "🍫"
        }
      ]
    }
  },
  {
    title: "Relaxing Playlist",
    icon: <MusicNoteIcon />,
    description: "Soothing tunes to help you unwind",
    color: "#FF1493",
    content: {
      type: "spotify",
      genres: [
        {
          name: "Soothing & Calm",
          description: "Gentle melodies to help you relax",
          url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX6VdMW310YC7",
          icon: "🎵"
        },
        {
          name: "Jazz",
          description: "Smooth jazz to ease your mind",
          url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4wta20PHgwo",
          icon: "🎷"
        },
        {
          name: "Lo-fi & Chill",
          description: "Calm beats for relaxation",
          url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn",
          icon: "🎧"
        }
      ]
    }
  },
  {
    title: "Share a Funny Meme",
    icon: <SentimentVerySatisfiedIcon />,
    description: "Let's brighten your day with some humor!",
    color: "#FF69B4",
    content: {
      type: "meme",
      memeCategories: [
        {
          text: "When you realize it's not PMS, you're just tired of everyone's nonsense 😂",
          emoji: "🤦‍♀️"
        },
        {
          text: "My uterus: Let's make this day interesting\nMe: Please no 😭",
          emoji: "🌋"
        },
        {
          text: "Chocolate: *exists*\nMe on my period: You're hired! 🍫",
          emoji: "🍫"
        }
      ],
      jokes: [
        "Why did the period app go to therapy? It had too many mood swings! 😄",
        "What did the uterus say to the heating pad? You're the only one who truly gets me! ❤️",
        "My period doesn't make me emotional... *bursts into tears while hugging chocolate bar* 😭"
      ]
    }
  }
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const moodImprovementOptions = [
  {
    title: 'Warm Comfort',
    icon: <LocalCafeIcon />,
    suggestions: [
      'Cozy up in a blanket with a soft pillow and relax',
      'Sip on a warm drink like herbal tea (ginger, chamomile) or hot chocolate'
    ]
  },
  {
    title: 'Gentle Movement',
    icon: <SpaIcon />,
    suggestions: [
      'Try light stretching (like child\'s pose or cat-cow stretch) to ease tension',
      'Go for a short, slow walk to improve circulation and boost mood',
      'Do a few yoga poses (like butterfly pose or happy baby pose) to relax muscles',
      'Dance lightly to your favorite calming or uplifting song'
    ]
  },
  {
    title: 'Mindfulness',
    icon: <FavoriteIcon />,
    suggestions: [
      'Try 5-minute deep breathing (inhale for 4 seconds, hold for 4, exhale for 6)',
      'Listen to a guided meditation for relaxation and mood balance',
      'Write down 3 things you\'re grateful for in a journal',
      'Close your eyes and do a body scan to release tension from head to toe'
    ]
  },
  {
    title: 'Comfort Food',
    icon: <LocalCafeIcon />,
    suggestions: [
      'Dark chocolate (boosts serotonin and eases cravings)',
      'Bananas (rich in potassium, helps with bloating and mood)',
      'Greek yogurt with honey (great for gut health and energy)',
      'Warm soup or oatmeal (soothing and easy to digest)'
    ]
  }
];

const LunaComfort = ({ userEmail }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showComfort, setShowComfort] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [response, setResponse] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [questions, setQuestions] = useState([initialQuestion]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [ventText, setVentText] = useState('');
  const [showVentBox, setShowVentBox] = useState(false);
  const [ventedThoughts, setVentedThoughts] = useState([]);
  const [showExplosion, setShowExplosion] = useState(false);
  const [showFeelingBetter, setShowFeelingBetter] = useState(false);
  const [showPaperPlane, setShowPaperPlane] = useState(false);
  const [showInitialQuestion, setShowInitialQuestion] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showComfortMessage, setShowComfortMessage] = useState(false);
  const [showComfortOptions, setShowComfortOptions] = useState(false);
  const [currentMemeIndex, setCurrentMemeIndex] = useState(0);
  const [showingJokes, setShowingJokes] = useState(false);
  const [jokeFromApi, setJokeFromApi] = useState('');
  const [loadingJoke, setLoadingJoke] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [reminderInterval, setReminderInterval] = useState(15);
  const [reminderEmail, setReminderEmail] = useState('');
  const [reminderSet, setReminderSet] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);
  const [showMoodOptions, setShowMoodOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Update the comfort state without using localStorage
  const updateComfortState = (state) => {
    setShowComfort(state);
  };

  const handleYesClick = () => {
    setShowResponse(true);
    setResponse("I'm here for you! Let's talk about how you're feeling.");
    setTimeout(() => {
      setOpenDialog(true);
      setShowInitialQuestion(true);
    }, 1500);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowResponse(false);
    setActiveStep(0);
    setAnswers({});
    setQuestions([initialQuestion]);
    setCurrentQuestion(initialQuestion);
    setShowVentBox(false);
    setVentText('');
    setVentedThoughts([]);
    setShowExplosion(false);
    setShowFeelingBetter(false);
    setShowPaperPlane(false);
    setShowInitialQuestion(false);
    setSelectedActivity(null);
    setShowComfortMessage(false);
    setShowComfortOptions(false);
    setCurrentMemeIndex(0);
    setShowingJokes(false);
  };

  const handleChatClick = () => {
    navigate('/chat');
  };

  const generateFollowUpQuestion = (mood) => {
    const followUpQuestions = {
      "Great!": {
        question: "What's making you feel great today?",
        options: ["Achieved something", "Spent time with loved ones", "Had a good day at work", "Just feeling positive"],
        type: "radio"
      },
      "Really down": {
        question: "Would you like to vent out your feelings?",
        options: ["Yes, I need to vent", "Not right now", "Maybe later"],
        type: "radio"
      }
    };

    return followUpQuestions[mood] || {
      question: "Would you like to talk about your feelings?",
      options: ["Yes, please", "Not right now", "Maybe later"],
      type: "radio"
    };
  };

  const handleAnswer = async (answer) => {
    setAnswers({ ...answers, [activeStep]: answer });
    
    if (activeStep === 0) {
      setLoading(true);
      try {
        if (answer === "Really down") {
          setShowComfortMessage(true);
          setResponse("I'm here for you. Periods can be tough, but you're stronger than you think.");
          setShowComfortOptions(false);
        } else if (answer === "Great!") {
          const followUpQuestion = generateFollowUpQuestion(answer);
          setQuestions([initialQuestion, followUpQuestion]);
          setCurrentQuestion(followUpQuestion);
          setActiveStep(1);
        }
      } catch (error) {
        console.error('Error generating follow-up question:', error);
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      if (answers[0] === "Great!") {
        setShowComfortMessage(true);
        setResponse("It's great to hear that you're feeling great! But if you need any further assistance, Luna your care assistant is there to help you.");
        setShowComfortOptions(true);
        setActiveStep(0);
        setAnswers({});
        setQuestions([initialQuestion]);
        setCurrentQuestion(initialQuestion);
      }
    } else if (activeStep < questions.length - 1) {
      setActiveStep(activeStep + 1);
      setCurrentQuestion(questions[activeStep + 1]);
    } else {
      handleSubmitAnswers();
    }
  };

  const handleSootheMeClick = () => {
    setShowComfortOptions(true);
  };

  const handleVentSubmit = () => {
    if (ventText.trim()) {
      setVentedThoughts([...ventedThoughts, ventText]);
      setVentText('');
      setShowExplosion(true);
      setTimeout(() => {
        setShowExplosion(false);
        setShowFeelingBetter(true);
      }, 2000);
    }
  };

  const handleFeelingBetter = (feeling) => {
    setShowFeelingBetter(false);
    if (feeling === "Yes") {
      setShowSuggestions(true);
      setAiResponse("I'm glad you're feeling better! Here are some activities to help maintain your positive mood:");
    } else {
      setShowVentBox(true);
    }
  };

  const handleSubmitAnswers = async () => {
    setLoading(true);
    try {
      // Process answers and show suggestions
      setShowSuggestions(true);
      setAiResponse("Based on how you're feeling, here are some activities that might help:");
    } catch (error) {
      console.error('Error processing answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewJoke = async () => {
    setLoadingJoke(true);
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single');
      const data = await response.json();
      if (data.joke) {
        setJokeFromApi(data.joke);
      }
    } catch (error) {
      console.error('Error fetching joke:', error);
      // Use fallback jokes if API fails
      const fallbackJoke = selectedActivity.content.jokes[Math.floor(Math.random() * selectedActivity.content.jokes.length)];
      setJokeFromApi(fallbackJoke);
    } finally {
      setLoadingJoke(false);
    }
  };

  const handleNextMeme = () => {
    if (showingJokes) {
      fetchNewJoke();
          } else {
      setCurrentMemeIndex((prev) => 
        (prev + 1) % selectedActivity.content.memeCategories.length
      );
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
    setShowComfortOptions(false);
    if (activity.content.type === "chat") {
      navigate('/chat');
    }
    if (activity.content.type === "meme" && showingJokes) {
      fetchNewJoke();
    }
  };

  const handleBackToOptions = () => {
    setSelectedActivity(null);
    setShowComfortOptions(true);
    setCurrentMemeIndex(0);
    setShowingJokes(false);
  };

  const handleToggleJokes = () => {
    setShowingJokes(!showingJokes);
    setCurrentMemeIndex(0);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const handleBackToGenres = () => {
    setSelectedGenre(null);
  };

  const handleItemToggle = (item) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSetReminder = async () => {
    if (!reminderEmail) {
      setShowEmailInput(true);
      return;
    }

    setSettingReminder(true);
    try {
      const response = await fetch('/api/reminders/set-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: reminderEmail,
          items: selectedItems,
          interval: reminderInterval
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReminderSet(true);
        setShowReminderOptions(false);
      } else {
        console.error('Error setting reminder:', data.error);
        alert('Failed to set reminder. Please try again.');
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Failed to set reminder. Please check your connection and try again.');
    } finally {
      setSettingReminder(false);
    }
  };

  const handleStopReminder = async () => {
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

      if (response.ok) {
        setReminderSet(false);
        setSelectedItems([]);
        setShowReminderOptions(false);
        setReminderEmail('');
      } else {
        alert('Failed to stop reminder. Please try again.');
      }
    } catch (error) {
      console.error('Error stopping reminder:', error);
      alert('Failed to stop reminder. Please check your connection and try again.');
    }
  };

  const sendFollowUpEmail = async (email, activity) => {
    try {
      const response = await fetch('/api/email/send-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          activity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send follow-up email');
      }
    } catch (error) {
      console.error('Error sending follow-up email:', error);
    }
  };

  const handleMoodOptionSelect = async (option) => {
    setSelectedActivity(option);
    setShowDialog(true);
    
    // Send follow-up email based on the selected activity
    if (userEmail) {
      let activityDescription = '';
      switch (option.content.type) {
        case 'warmth':
          activityDescription = 'warm bath or heating pad session';
          break;
        case 'yoga':
          activityDescription = 'gentle yoga stretches';
          break;
        case 'breathing':
          activityDescription = 'mindfulness breathing exercise';
          break;
        case 'snacks':
          activityDescription = 'comfort food preparation';
          break;
      }
      await sendFollowUpEmail(userEmail, activityDescription);
    }
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setLoading(true);
    
    try {
      // Show the selected option's suggestions immediately
      setSelectedActivity({
        ...option,
        content: {
          type: 'suggestions',
          suggestions: option.suggestions
        }
      });

      // Send follow-up email after 5 minutes
      if (userEmail) {
        setTimeout(async () => {
          try {
            const response = await fetch('/api/reminders/send-follow-up-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: userEmail,
                activity: option.title,
                selectedSuggestion: option.suggestions[0]
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to send follow-up email');
            }

            console.log('Follow-up email sent successfully');
          } catch (error) {
            console.error('Error sending follow-up email:', error);
          }
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
      }
    } catch (error) {
      console.error('Error handling option selection:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderActivityContent = () => {
    if (!selectedActivity) return null;

    switch (selectedActivity.content.type) {
      case "suggestions":
  return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF1493', mb: 3, textAlign: 'center' }}>
              {selectedActivity.title} Suggestions
            </Typography>
            <List>
              {selectedActivity.content.suggestions.map((suggestion, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    bgcolor: alpha('#FF69B4', 0.1),
                    borderRadius: 1,
                    mb: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#FF69B4', 0.2),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <ListItemIcon>
                    {selectedActivity.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body1" sx={{ color: '#333' }}>
                        {suggestion}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      case "meme":
        return (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF1493', mb: 3 }}>
              {showingJokes ? "Here's a joke to make you smile!" : "Here's something to make you smile!"}
            </Typography>
            
            {showingJokes ? (
              <Box sx={{ position: 'relative' }}>
                {loadingJoke && (
                  <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <CircularProgress size={24} sx={{ color: '#FF1493' }} />
                  </Box>
                )}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#333',
                    mb: 3,
                    p: 4,
                    borderRadius: 2,
                    bgcolor: alpha('#FF69B4', 0.1),
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loadingJoke ? 0.5 : 1
                  }}
                >
                  {jokeFromApi || selectedActivity.content.jokes[currentMemeIndex]}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  p: 4,
                  borderRadius: 2,
                  bgcolor: alpha('#FF69B4', 0.1),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#333',
                    mb: 2,
                    textAlign: 'center',
                    fontSize: '4rem'
                  }}
                >
                  {selectedActivity.content.memeCategories[currentMemeIndex].emoji}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#333',
                    textAlign: 'center',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {selectedActivity.content.memeCategories[currentMemeIndex].text}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleNextMeme}
                startIcon={showingJokes ? <AutorenewIcon /> : <SentimentVerySatisfiedIcon />}
                sx={{
                  bgcolor: '#FF1493',
                  color: 'white',
                  '&:hover': { bgcolor: '#FF69B4' }
                }}
              >
                Show me another one!
              </Button>
              <Button
                variant="outlined"
                onClick={handleToggleJokes}
                startIcon={showingJokes ? <EmojiEmotionsIcon /> : <ChatIcon />}
                sx={{
                  color: '#FF1493',
                  borderColor: '#FF1493',
                  '&:hover': { bgcolor: alpha('#FF1493', 0.1) }
                }}
              >
                {showingJokes ? 'Show me memes instead!' : 'Show me jokes instead!'}
              </Button>
            </Box>
          </Box>
        );
      case "spotify":
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF1493', mb: 3, textAlign: 'center' }}>
              {selectedGenre ? "Let the music soothe your soul" : "What kind of music would help you feel better?"}
            </Typography>
            
            {selectedGenre ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToGenres}
                    sx={{
                      color: '#FF1493',
                      '&:hover': { bgcolor: alpha('#FF1493', 0.1) }
                    }}
                  >
                    Choose different genre
                  </Button>
                </Box>
                <iframe
                  src={selectedGenre.url}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                />
              </>
            ) : (
              <Grid container spacing={2}>
                {selectedActivity.content.genres.map((genre, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => handleGenreSelect(genre)}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h4" sx={{ color: '#FF1493' }}>
                            {genre.icon}
                          </Typography>
                          <Box>
                            <Typography variant="h6" sx={{ color: '#FF1493' }}>
                              {genre.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {genre.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        );
      case "list":
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ color: '#FF1493', mb: 3, textAlign: 'center' }}>
              Take care of yourself with these gentle activities
            </Typography>
            
            <List>
              {selectedActivity.content.items.map((item, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    bgcolor: selectedItems.includes(item.text) ? alpha('#FF69B4', 0.1) : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha('#FF69B4', 0.05),
                    }
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={selectedItems.includes(item.text)}
                      onChange={() => handleItemToggle(item.text)}
                      sx={{
                        color: '#FF69B4',
                        '&.Mui-checked': {
                          color: '#FF1493',
                        },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>
                          {item.icon}
                        </Typography>
                        <Typography>{item.text}</Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {selectedItems.length > 0 && !showReminderOptions && !reminderSet && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AccessTimeIcon />}
                  onClick={() => setShowReminderOptions(true)}
                  sx={{
                    bgcolor: '#FF1493',
                    '&:hover': { bgcolor: '#FF69B4' }
                  }}
                >
                  Set Reminder
                </Button>
              </Box>
            )}

            {showReminderOptions && !reminderSet && (
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha('#FF69B4', 0.1), borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#FF1493', mb: 2 }}>
                  Set Reminder
                </Typography>
                
                {!showEmailInput ? (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      How often would you like to be reminded?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {[5, 10, 15, 20, 25, 30].map((minutes) => (
                        <Button
                          key={minutes}
                          variant={reminderInterval === minutes ? "contained" : "outlined"}
                          onClick={() => setReminderInterval(minutes)}
                          sx={{
                            color: reminderInterval === minutes ? 'white' : '#FF1493',
                            borderColor: '#FF1493',
                            '&:hover': {
                              borderColor: '#FF1493',
                              bgcolor: alpha('#FF1493', 0.1),
                            }
                          }}
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<EmailIcon />}
                      onClick={() => setShowEmailInput(true)}
                      sx={{
                        bgcolor: '#FF1493',
                        '&:hover': { bgcolor: '#FF69B4' }
                      }}
                    >
                      Continue
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Enter your email address to receive reminders:
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setShowEmailInput(false)}
                        sx={{
                          color: '#FF1493',
                          borderColor: '#FF1493',
                          '&:hover': {
                            borderColor: '#FF1493',
                            bgcolor: alpha('#FF1493', 0.1),
                          }
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSetReminder}
                        disabled={settingReminder}
                        sx={{
                          bgcolor: '#FF1493',
                          '&:hover': { bgcolor: '#FF69B4' }
                        }}
                      >
                        {settingReminder ? (
                          <>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                            Setting Reminder...
                          </>
                        ) : (
                          'Set Reminder'
                        )}
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}

            {reminderSet && (
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha('#4CAF50', 0.1), borderRadius: 2 }}>
                <Typography variant="body1" sx={{ color: '#4CAF50', textAlign: 'center', mb: 2 }}>
                  Reminder set successfully! You'll receive gentle reminders every {reminderInterval} minutes.
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleStopReminder}
                  sx={{
                    color: '#FF1493',
                    borderColor: '#FF1493',
                    '&:hover': {
                      borderColor: '#FF1493',
                      bgcolor: alpha('#FF1493', 0.1),
                    }
                  }}
                >
                  Stop Reminders
                </Button>
              </Box>
            )}
          </Box>
        );
      case "warmth":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Warm Comfort Suggestions
            </Typography>
            {selectedActivity.content.suggestions.map((suggestion, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {suggestion}
                </Typography>
              </Card>
            ))}
          </Box>
        );
      case "yoga":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Gentle Yoga Poses
            </Typography>
            {selectedActivity.content.suggestions.map((suggestion, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {suggestion}
                </Typography>
              </Card>
            ))}
          </Box>
        );
      case "breathing":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              {selectedActivity.content.suggestions.map((suggestion, index) => (
                <Card key={index} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {suggestion}
                  </Typography>
                </Card>
              ))}
            </Typography>
          </Box>
        );
      case "snacks":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Comfort Food Suggestions
            </Typography>
            {selectedActivity.content.suggestions.map((suggestion, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {suggestion}
                </Typography>
              </Card>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Fade in={showComfort} timeout={1000}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: `linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)`,
              color: 'white',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: showComfort ? 'block' : 'none',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    width: 50,
                    height: 50,
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  }}
                >
                  <ChatIcon sx={{ color: '#FF1493' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }} gutterBottom>
                    Luna's Check-in
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                    Would you like some comfort today?
                  </Typography>
                  {!showResponse && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: 'white',
                          color: '#FF1493',
                          '&:hover': {
                            bgcolor: 'white',
                            transform: 'scale(1.05)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                          },
                        }}
                        onClick={handleYesClick}
                        startIcon={<FavoriteIcon />}
                      >
                        Yes, please
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: 'white',
                          color: 'white',
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                        onClick={() => updateComfortState(false)}
                      >
                        Maybe later
                      </Button>
                    </Box>
                  )}
                  {showResponse && (
                    <Fade in={true} timeout={500}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mt: 2,
                          color: 'white',
                          fontStyle: 'italic',
                        }}
                      >
                        {response}
                      </Typography>
                    </Fade>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: '#FF1493',
          borderBottom: '2px solid #FF69B4',
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {selectedActivity && !showComfortOptions && (
            <IconButton 
              onClick={handleBackToOptions}
              sx={{ color: '#FF1493' }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FavoriteIcon sx={{ fontSize: 40, mb: 1, color: '#FF1493' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, ml: 1 }}>
              Luna's Comfort Corner
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {showComfortMessage ? (
            <>
              <Typography variant="body1" sx={{ mb: 3, color: '#333', textAlign: 'center' }}>
                {response}
              </Typography>
              {!showComfortOptions && !selectedActivity && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleSootheMeClick}
                    startIcon={<FavoriteIcon />}
                    sx={{
                  bgcolor: '#FF1493',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#FF69B4',
                        transform: 'scale(1.05)',
                      },
                      px: 4,
                      py: 1.5,
                      borderRadius: 25,
                    }}
                  >
                    Soothe me
                  </Button>
                </Box>
              )}
              {showComfortOptions && !selectedActivity && (
                <>
                  <Typography variant="h6" sx={{ color: '#FF1493', mb: 2, textAlign: 'center' }}>
                    What can I do to help you feel better?
                  </Typography>
                  <Grid container spacing={2}>
                    {comfortActivities.map((activity, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            }
                          }}
                          onClick={() => handleActivityClick(activity)}
                        >
                          <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box sx={{ 
                                color: activity.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: alpha(activity.color, 0.1)
                              }}>
                                {activity.icon}
            </Box>
                              <Box>
                                <Typography variant="h6" sx={{ color: activity.color }}>
                                  {activity.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {selectedActivity && renderActivityContent()}
            </>
          ) : showFeelingBetter ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#FF1493', mb: 2 }}>
                Are you feeling better now?
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => handleFeelingBetter("Yes")}
                  sx={{
                    bgcolor: '#FF1493',
                    '&:hover': {
                      bgcolor: '#FF1493',
                    }
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleFeelingBetter("No")}
                  sx={{
                    borderColor: '#FF1493',
                    color: '#FF1493',
                    '&:hover': {
                      borderColor: '#FF1493',
                      bgcolor: alpha('#FF1493', 0.1),
                    }
                  }}
                >
                  No
                </Button>
              </Box>
            </Box>
          ) : showVentBox ? (
            <Box sx={{ position: 'relative', height: '400px' }}>
              <Typography variant="h6" sx={{ color: '#FF1493', mb: 2 }}>
                Vent Out Your Feelings
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                Write whatever you want to get off your chest. Your thoughts will float away into space...
              </Typography>
              
              <Box sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Type your thoughts here..."
                  value={ventText}
                  onChange={(e) => setVentText(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#FF1493',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#FF1493',
                      },
                    }
                  }}
                />
                <IconButton
                  onClick={handleVentSubmit}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    color: '#FF1493',
                    '&:hover': {
                      bgcolor: alpha('#FF1493', 0.1),
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>

              <Box sx={{ 
                position: 'relative', 
                height: '200px', 
                overflow: 'hidden',
                border: '1px dashed #FFE4E1',
                borderRadius: 2,
                p: 2
              }}>
                {ventedThoughts.map((thought, index) => (
                  <Typography
                    key={index}
                    sx={{
                      position: 'absolute',
                      left: `${Math.random() * 80 + 10}%`,
                      animation: `${floatUp} 3s ease-out forwards`,
                      animationDelay: `${index * 0.5}s`,
                      color: '#FF1493',
                      fontSize: '0.9rem',
                      opacity: 0.8
                    }}
                  >
                    {thought}
                  </Typography>
                ))}
              </Box>

              {showPaperPlane && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10%',
                    transform: 'translate(-50%, -50%)',
                    animation: `${floatUp} 2.5s ease-in-out forwards`,
                    zIndex: 2
                  }}
                >
                  <PaperPlaneIcon 
                    sx={{ 
                      fontSize: 50, 
                      color: '#FF1493',
                      transform: 'rotate(45deg)',
                      filter: 'drop-shadow(0 0 5px rgba(255, 20, 147, 0.5))'
                    }} 
                  />
                </Box>
              )}

              {showExplosion && (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '80%',
                      transform: 'translate(-50%, -50%)',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${alpha('#FF1493', 0.9)} 0%, ${alpha('#FF69B4', 0.5)} 100%)`,
                      animation: `${explode} 1.5s ease-out forwards`,
                      zIndex: 1
                    }}
                  />
                  {[...Array(8)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '80%',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                        width: '4px',
                        height: '20px',
                        background: '#FF1493',
                        animation: `${sparkle} 1s ease-out forwards`,
                        animationDelay: `${i * 0.1}s`,
                        zIndex: 2
                      }}
                    />
                  ))}
                </>
              )}

              {showVideo && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <video
                    autoPlay
                    loop={false}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onEnded={() => {
                      setShowVideo(false);
                      setShowFeelingBetter(true);
                    }}
                  >
                    <source src="/path-to-your-animation.mp4" type="video/mp4" />
                  </video>
                </Box>
              )}
            </Box>
          ) : showSuggestions ? (
            <>
              <Typography variant="body1" sx={{ mb: 3, color: '#333' }}>
                {aiResponse}
              </Typography>
              <Grid container spacing={2}>
                {comfortActivities.map((activity, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => handleActivityClick(activity)}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Box sx={{ 
                            color: activity.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: alpha(activity.color, 0.1)
                          }}>
                            {activity.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ color: activity.color }}>
                              {activity.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChatClick}
                  startIcon={<ChatIcon />}
                  sx={{
                    bgcolor: '#FF1493',
                    '&:hover': {
                      bgcolor: '#FF1493',
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  Chat with Luna
                </Button>
              </Box>
            </>
          ) : showMoodOptions ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#FF1493', textAlign: 'center', mb: 3 }}>
                Choose what might help:
              </Typography>
              <Grid container spacing={2}>
                {moodImprovementOptions.map((option, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        }
                      }}
                      onClick={() => handleOptionSelect(option)}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box sx={{ 
                          color: '#FF1493',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: alpha('#FF1493', 0.1),
                          margin: '0 auto 16px'
                        }}>
                          {option.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: '#FF1493' }}>
                          {option.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {questions.map((_, index) => (
                  <Step key={index}>
                    <StepLabel />
                  </Step>
                ))}
              </Stepper>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#FF1493', mb: 2 }}>
                  {currentQuestion.question}
                </Typography>
                
                {currentQuestion.type === 'radio' ? (
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={answers[activeStep] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={<Radio sx={{ color: '#FF1493' }} />}
                          label={option}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: '#333',
                            },
                            '&:hover': {
                              bgcolor: '#FFF0F5',
                              borderRadius: 1,
                            }
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Tell me more..."
                    value={answers[activeStep] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#FF1493',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF1493',
                        },
                      }
                    }}
                  />
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: 3,
          borderTop: '2px solid #FFE4E1'
        }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              color: '#FF1493',
              '&:hover': {
                bgcolor: '#FFF0F5',
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LunaComfort; 