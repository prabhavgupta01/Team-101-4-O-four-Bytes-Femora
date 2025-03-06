import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  Avatar,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';

const PCOS_SYMPTOMS = [
  {
    question: "Have you been experiencing irregular periods?",
    followUp: "How irregular are they?",
    options: ["Very irregular (more than 35 days)", "Sometimes irregular", "Regular"],
    weight: 2
  },
  {
    question: "Have you noticed excessive hair growth on your face, chest, or back?",
    followUp: "How severe is the hair growth?",
    options: ["Severe", "Moderate", "Mild", "None"],
    weight: 2
  },
  {
    question: "Have you been experiencing acne or oily skin?",
    followUp: "How would you describe your acne?",
    options: ["Severe", "Moderate", "Mild", "None"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your weight?",
    followUp: "What kind of weight changes?",
    options: ["Difficulty losing weight", "Unexpected weight gain", "No changes"],
    weight: 2
  },
  {
    question: "Have you been experiencing fatigue or low energy levels?",
    followUp: "How often do you feel fatigued?",
    options: ["Very often", "Sometimes", "Rarely", "Never"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your hair on your head?",
    followUp: "What kind of changes?",
    options: ["Thinning", "Hair loss", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing mood swings or depression?",
    followUp: "How severe are your mood changes?",
    options: ["Very severe", "Moderate", "Mild", "None"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your sleep patterns?",
    followUp: "What kind of sleep issues?",
    options: ["Difficulty falling asleep", "Difficulty staying asleep", "No issues"],
    weight: 1
  },
  {
    question: "Have you been experiencing pelvic pain?",
    followUp: "How would you describe the pain?",
    options: ["Severe", "Moderate", "Mild", "None"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your appetite?",
    followUp: "What kind of appetite changes?",
    options: ["Increased appetite", "Decreased appetite", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing headaches or migraines?",
    followUp: "How frequent are they?",
    options: ["Very frequent", "Sometimes", "Rarely", "Never"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your skin color or texture?",
    followUp: "What kind of changes?",
    options: ["Dark patches", "Rough texture", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing bloating or digestive issues?",
    followUp: "How often do you experience these issues?",
    options: ["Very often", "Sometimes", "Rarely", "Never"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your libido?",
    followUp: "What kind of changes?",
    options: ["Decreased", "Increased", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing anxiety or panic attacks?",
    followUp: "How severe is your anxiety?",
    options: ["Very severe", "Moderate", "Mild", "None"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your menstrual flow?",
    followUp: "What kind of changes?",
    options: ["Heavier flow", "Lighter flow", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing joint or muscle pain?",
    followUp: "How severe is the pain?",
    options: ["Severe", "Moderate", "Mild", "None"],
    weight: 1
  },
  {
    question: "Have you noticed any changes in your nails?",
    followUp: "What kind of changes?",
    options: ["Brittle nails", "Slow growth", "No changes"],
    weight: 1
  },
  {
    question: "Have you been experiencing hot flashes or night sweats?",
    followUp: "How frequent are they?",
    options: ["Very frequent", "Sometimes", "Rarely", "Never"],
    weight: 1
  }
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: '15px',
  maxWidth: '80%',
  wordWrap: 'break-word',
}));

const PCOSChecker = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleStartCheck = () => {
    setOpenDialog(true);
    setCurrentSymptomIndex(0);
    setAnswers({});
    setShowFollowUp(false);
    setShowResult(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSymptomIndex(0);
    setAnswers({});
    setShowFollowUp(false);
    setShowResult(false);
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.values(answers).forEach((answer, index) => {
      const symptom = PCOS_SYMPTOMS[index];
      const answerIndex = symptom.options.indexOf(answer);
      const weight = symptom.weight;
      
      if (answerIndex === 0) totalScore += weight * 3;
      else if (answerIndex === 1) totalScore += weight * 2;
      else if (answerIndex === 2) totalScore += weight;
    });

    setScore(totalScore);

    if (totalScore >= 40) {
      setRiskLevel('High Risk');
      setRecommendations([
        "Schedule an appointment with a gynecologist or endocrinologist",
        "Consider getting blood tests for hormone levels",
        "Start tracking your menstrual cycle and symptoms",
        "Consider lifestyle changes like diet and exercise"
      ]);
    } else if (totalScore >= 25) {
      setRiskLevel('Moderate Risk');
      setRecommendations([
        "Monitor your symptoms and keep a diary",
        "Consider consulting a healthcare provider",
        "Focus on maintaining a healthy lifestyle",
        "Track your menstrual cycle regularly"
      ]);
    } else {
      setRiskLevel('Low Risk');
      setRecommendations([
        "Continue monitoring your health",
        "Maintain a healthy lifestyle",
        "Keep track of any new symptoms",
        "Schedule regular check-ups with your healthcare provider"
      ]);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentSymptomIndex]: answer });
    setShowFollowUp(true);
  };

  const handleNext = () => {
    if (currentSymptomIndex < PCOS_SYMPTOMS.length - 1) {
      setCurrentSymptomIndex(currentSymptomIndex + 1);
      setShowFollowUp(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        calculateScore();
        setShowResult(true);
        setLoading(false);
      }, 1000);
    }
  };

  const renderCurrentQuestion = () => {
    const currentSymptom = PCOS_SYMPTOMS[currentSymptomIndex];
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#FF1493' }}>
            <ChatIcon />
          </Avatar>
          <StyledPaper elevation={0} sx={{ bgcolor: alpha('#FF1493', 0.1) }}>
            <Typography variant="body1">
              {currentSymptom.question}
            </Typography>
          </StyledPaper>
        </Box>

        {showFollowUp && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, ml: 4 }}>
            <Avatar sx={{ bgcolor: '#FF1493' }}>
              <ChatIcon />
            </Avatar>
            <StyledPaper elevation={0} sx={{ bgcolor: alpha('#FF1493', 0.1) }}>
              <Typography variant="body1">
                {currentSymptom.followUp}
              </Typography>
            </StyledPaper>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 4 }}>
          {currentSymptom.options.map((option, index) => (
            <Button
              key={index}
              variant={answers[currentSymptomIndex] === option ? "contained" : "outlined"}
              onClick={() => handleAnswer(option)}
              sx={{
                color: answers[currentSymptomIndex] === option ? 'white' : '#FF1493',
                borderColor: '#FF1493',
                '&:hover': {
                  borderColor: '#FF1493',
                  bgcolor: alpha('#FF1493', 0.1),
                }
              }}
            >
              {option}
            </Button>
          ))}
        </Box>

        {showFollowUp && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<SendIcon />}
              sx={{
                bgcolor: '#FF1493',
                '&:hover': {
                  bgcolor: '#FF69B4',
                }
              }}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const renderResult = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h5" sx={{ color: '#FF1493', mb: 3 }}>
          Your PCOS Risk Assessment
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            color: riskLevel === 'High Risk' ? '#FF1493' : 
                   riskLevel === 'Moderate Risk' ? '#FF69B4' : '#FFB6C1',
            mb: 1
          }}>
            {riskLevel}
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Score: {score} out of 60
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ color: '#FF1493', mb: 2 }}>
          Recommendations
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {recommendations.map((rec, index) => (
            <StyledPaper 
              key={index}
              elevation={0}
              sx={{ 
                bgcolor: alpha('#FF1493', 0.1),
                maxWidth: '80%',
                p: 2
              }}
            >
              <Typography variant="body1">
                {rec}
              </Typography>
            </StyledPaper>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleStartCheck}
        startIcon={<FavoriteIcon />}
        sx={{
          bgcolor: '#FF1493',
          '&:hover': {
            bgcolor: '#FF69B4',
          }
        }}
      >
        Start PCOS Check
      </Button>

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
          pb: 2
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Luna's PCOS Check
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#FF1493' }} />
            </Box>
          ) : showResult ? (
            renderResult()
          ) : (
            renderCurrentQuestion()
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

export default PCOSChecker; 