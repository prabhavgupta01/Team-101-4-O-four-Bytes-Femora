import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  useTheme,
  alpha,
  Avatar,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: '15px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
}));

const MessageBubble = styled(Box)(({ theme, isLuna }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexDirection: isLuna ? 'row' : 'row-reverse',
}));

const BubbleContent = styled(Box)(({ theme, isLuna }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: '15px',
  background: isLuna 
    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
    : theme.palette.primary.main,
  color: isLuna ? theme.palette.text.primary : theme.palette.primary.contrastText,
  boxShadow: theme.shadows[1],
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  overflowY: 'auto',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.primary.dark,
    },
  },
}));

const QUESTIONS = [
  {
    id: 'cycle_length',
    question: 'Hi! I\'m Luna. Let\'s check your PCOS symptoms together. First, could you tell me about your cycle length?',
    options: [
      { value: 'regular', label: 'My cycles were mostly 21 to 35 days' },
      { value: 'short', label: '2 (or more) were shorter than 21 days' },
      { value: 'long', label: '2 (or more) were longer than 35 days' },
      { value: 'unsure', label: 'I\'m not sure' }
    ],
    type: 'radio'
  },
  {
    id: 'unpredictable_periods',
    question: 'In the past 12 months, was your period often unpredictable, and if so, how many days early/late is it?',
    options: [
      { value: 'upto7', label: 'Up to 7 days' },
      { value: 'more8', label: '8 or more days' },
      { value: 'not_unpredictable', label: 'It\'s not unpredictable' },
      { value: 'unsure', label: 'I\'m not sure' }
    ],
    type: 'radio'
  },
  {
    id: 'missed_periods',
    question: 'In past 12 months, have you gone more than 3 months without a period? (Exclude any obvious reasons for missed periods, i.e., pregnancy or hormonal birth control)',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'I\'m not sure' }
    ],
    type: 'radio'
  },
  {
    id: 'period_duration',
    question: 'How long does your period usually last?',
    options: [
      { value: '1day', label: '1 day or less' },
      { value: '2to7', label: '2 to 7 days' },
      { value: '8plus', label: '8 days or more' },
      { value: 'unsure', label: 'I\'m not sure' }
    ],
    type: 'radio'
  },
  {
    id: 'spotting',
    question: 'Spotting is like bleeding between periods. It may look like tiny drops of blood or pinkish white/brown discharge. In the last three months, did you notice any spotting between periods?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ],
    type: 'radio'
  },
  {
    id: 'height_weight',
    question: 'Would you like to enter your height and weight? This helps calculate BMI, which is an important factor in PCOS assessment.',
    options: [
      { value: 'yes', label: 'I am fine with telling it' },
      { value: 'no', label: 'Skip all height/weight questions' }
    ],
    type: 'radio'
  }
];

const PCOSTracker = () => {
  const theme = useTheme();
  const chatContainerRef = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showHeightWeightDialog, setShowHeightWeightDialog] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [step, answers, showResult]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    if (questionId === 'height_weight' && value === 'yes') {
      setShowHeightWeightDialog(true);
      return;
    }

    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleHeightWeightSubmit = async () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
      setShowHeightWeightDialog(false);
      setShowResult(true);
    }
  };

  const renderUserResponse = (questionId, value) => {
    const question = QUESTIONS.find(q => q.id === questionId);
    const selectedOption = question.options.find(opt => opt.value === value);
    return (
      <MessageBubble isLuna={false}>
        <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>U</Avatar>
        <BubbleContent isLuna={false}>
          <Typography variant="body1">
            {selectedOption.label}
          </Typography>
        </BubbleContent>
      </MessageBubble>
    );
  };

  const renderQuestion = (question, isCurrent = false) => {
    return (
      <Fade in timeout={500}>
        <MessageBubble isLuna>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>L</Avatar>
          <BubbleContent isLuna>
            <Typography variant="body1" gutterBottom>
              {question.question}
            </Typography>
            {isCurrent && (
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <RadioGroup
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '1rem',
                        },
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 1,
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </BubbleContent>
        </MessageBubble>
      </Fade>
    );
  };

  const renderHeightWeightDialog = () => (
    <Dialog open={showHeightWeightDialog} onClose={() => setShowHeightWeightDialog(false)}>
      <DialogTitle>Enter Your Height and Weight</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            label="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            fullWidth
          />
          <TextField
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowHeightWeightDialog(false)}>Cancel</Button>
        <Button onClick={handleHeightWeightSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderResult = () => {
    const symptomCount = Object.values(answers).filter(value => value === 'yes').length;
    return (
      <Fade in timeout={500}>
        <MessageBubble isLuna>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>L</Avatar>
          <BubbleContent isLuna>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
              Your PCOS Symptom Check Results
            </Typography>
            <Typography variant="body1" paragraph>
              Out of the questions answered, you've indicated experiencing {symptomCount} symptoms.
            </Typography>
            {bmi && (
              <Typography variant="body1" paragraph>
                Your BMI is {bmi}.
              </Typography>
            )}
            {symptomCount >= 3 ? (
              <Typography variant="body1" sx={{ color: theme.palette.error.main, fontWeight: 'bold' }}>
                Based on your responses, there is a potential risk for PCOS. I recommend consulting with a healthcare provider for a proper diagnosis.
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                Based on your responses, you show a lower risk for PCOS. However, if you have concerns about your health, please consult with a healthcare provider.
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => {
                setStep(0);
                setAnswers({});
                setShowResult(false);
                setHeight('');
                setWeight('');
                setBmi(null);
              }}
              sx={{ mt: 2 }}
            >
              Start Over
            </Button>
          </BubbleContent>
        </MessageBubble>
      </Fade>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', height: '100vh', display: 'flex', flexDirection: 'column', pt: 12 }}>
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, mb: 4 }}>
        PCOS Symptom Check with Luna
      </Typography>
      
      <ChatContainer ref={chatContainerRef}>
        {QUESTIONS.slice(0, step).map((question, index) => (
          <React.Fragment key={question.id}>
            {renderQuestion(question)}
            {renderUserResponse(question.id, answers[question.id])}
          </React.Fragment>
        ))}
        
        {!showResult && renderQuestion(QUESTIONS[step], true)}
        {showResult && renderResult()}
      </ChatContainer>

      {renderHeightWeightDialog()}
    </Box>
  );
};

export default PCOSTracker; 