import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Box,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const healthTopics = [
  {
    id: 'vaginal-discharge',
    title: 'Vaginal Discharge',
    icon: '💧',
    color: '#FF69B4',
    images: [
      {
        url: 'https://i.postimg.cc/TwgK6tSW/endo-1.jpg',
        info: 'Normal vs abnormal discharge patterns and their significance.'
      },
      {
        url: 'https://i.postimg.cc/fb6VpGHN/endo-2.jpg',
        info: 'Understanding different colors and consistencies of discharge.'
      },
      {
        url: 'https://i.postimg.cc/D0cmW87v/endo-3.jpg',
        info: 'When to seek medical advice for unusual discharge.'
      },
      {
        url: 'https://i.postimg.cc/8CFFypm4/endo-4.jpg',
        info: 'Tips for maintaining proper vaginal hygiene.'
      },
      {
        url: 'https://i.postimg.cc/nrxCcvbS/endo-5.jpg',
        info: 'Importance of regular health check-ups.'
      },
      {
        url: 'https://i.postimg.cc/tRdsvmWK/endo-6.jpg',
        info: 'Common causes and prevention of discharge issues.'
      }
    ]
  },
  {
    id: 'vaginal-odour',
    title: 'Vaginal Odour',
    icon: '🌸',
    color: '#4ECDC4',
    images: [
      {
        url: 'https://i.postimg.cc/MHG79bcf/odour-image-2.png',
        info: 'Understanding normal vaginal odor variations.'
      },
      {
        url: 'https://i.postimg.cc/qBmXzYYs/odour-image-3.jpg',
        info: 'Common causes of odor changes during menstruation.'
      },
      {
        url: 'https://i.postimg.cc/pdYKx1zn/odour-image-4.jpg',
        info: 'Impact of diet and lifestyle on vaginal odor.'
      },
      {
        url: 'https://i.postimg.cc/L65d1cs2/mensuration-2.jpg',
        info: 'When odor changes indicate health concerns.'
      },
      {
        url: 'https://i.postimg.cc/3NLPqBns/mensuration-3.jpg',
        info: 'Tips for maintaining healthy vaginal odor.'
      },
      {
        url: 'https://i.postimg.cc/Gt3WzNJP/mensuration-4.jpg',
        info: 'Products to avoid for maintaining natural balance.'
      }
    ]
  },
  {
    id: 'menstrual-cycle',
    title: 'Menstrual Cycle',
    icon: '🌙',
    color: '#45B7D1',
    images: [
      {
        url: 'https://i.postimg.cc/L65d1cs2/mensuration-2.jpg',
        info: 'Track your menstrual cycle to understand your body\'s patterns.'
      },
      {
        url: 'https://i.postimg.cc/3NLPqBns/mensuration-3.jpg',
        info: 'Regular periods typically occur every 21-35 days.'
      },
      {
        url: 'https://i.postimg.cc/Gt3WzNJP/mensuration-4.jpg',
        info: 'Period flow usually lasts 3-7 days with varying intensity.'
      },
      {
        url: 'https://i.postimg.cc/zDgr3Sbf/hormones.jpg',
        info: 'Common symptoms and how to manage them effectively.'
      },
      {
        url: 'https://i.postimg.cc/yYcmvdxP/hormonal-1.jpg',
        info: 'Importance of tracking menstrual health over time.'
      },
      {
        url: 'https://i.postimg.cc/yNQck3pV/hormonal-2.jpg',
        info: 'When to consult a healthcare provider about cycle changes.'
      }
    ]
  },
  {
    id: 'hormonal-health',
    title: 'Hormonal Health',
    icon: '⚡',
    color: '#96CEB4',
    images: [
      {
        url: 'https://i.postimg.cc/zDgr3Sbf/hormones.jpg',
        info: 'Hormones play a crucial role in regulating menstrual cycles.'
      },
      {
        url: 'https://i.postimg.cc/yYcmvdxP/hormonal-1.jpg',
        info: 'Estrogen and progesterone levels fluctuate throughout the cycle.'
      },
      {
        url: 'https://i.postimg.cc/yNQck3pV/hormonal-2.jpg',
        info: 'Stress can impact hormonal balance and menstrual regularity.'
      },
      {
        url: 'https://i.postimg.cc/pXnDdBFk/menopause.jpg',
        info: 'Signs and symptoms of hormonal imbalances.'
      },
      {
        url: 'https://i.postimg.cc/0jhDfzLp/menopause-1.jpg',
        info: 'Lifestyle factors that affect hormonal health.'
      },
      {
        url: 'https://i.postimg.cc/mrV9nXvZ/menopause-2.jpg',
        info: 'Treatment options for hormonal imbalances.'
      }
    ]
  },
  {
    id: 'endometriosis',
    title: 'Endometriosis',
    icon: '🔴',
    color: '#FF6B6B',
    images: [
      {
        url: 'https://i.postimg.cc/TwgK6tSW/endo-1.jpg',
        info: 'Understanding endometriosis and its impact on women\'s health.'
      },
      {
        url: 'https://i.postimg.cc/fb6VpGHN/endo-2.jpg',
        info: 'Common symptoms and signs of endometriosis.'
      },
      {
        url: 'https://i.postimg.cc/D0cmW87v/endo-3.jpg',
        info: 'Diagnosis methods and treatment options available.'
      },
      {
        url: 'https://i.postimg.cc/8CFFypm4/endo-4.jpg',
        info: 'Lifestyle changes to manage endometriosis symptoms.'
      },
      {
        url: 'https://i.postimg.cc/nrxCcvbS/endo-5.jpg',
        info: 'Impact on fertility and reproductive health.'
      },
      {
        url: 'https://i.postimg.cc/tRdsvmWK/endo-6.jpg',
        info: 'Support resources and coping strategies.'
      }
    ]
  },
  {
    id: 'menopause-perimenopause',
    title: 'Menopause/Perimenopause',
    icon: '🌡️',
    color: '#FF69B4',
    images: [
      {
        url: 'https://i.postimg.cc/pXnDdBFk/menopause.jpg',
        info: 'Understanding the stages of menopause helps prepare for the transition.'
      },
      {
        url: 'https://i.postimg.cc/0jhDfzLp/menopause-1.jpg',
        info: 'Perimenopause symptoms can begin several years before menopause.'
      },
      {
        url: 'https://i.postimg.cc/mrV9nXvZ/menopause-2.jpg',
        info: 'Hot flashes and night sweats are common symptoms during this phase.'
      },
      {
        url: 'https://i.postimg.cc/MHG79bcf/odour-image-2.png',
        info: 'Managing emotional changes during menopause.'
      },
      {
        url: 'https://i.postimg.cc/qBmXzYYs/odour-image-3.jpg',
        info: 'Treatment options for menopausal symptoms.'
      },
      {
        url: 'https://i.postimg.cc/pdYKx1zn/odour-image-4.jpg',
        info: 'Long-term health considerations after menopause.'
      }
    ]
  }
];

const Insights = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleCardFlip = (topicId, cardIndex) => {
    const cardKey = `${topicId}-${cardIndex}`;
    setFlippedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));

    // Set a timeout to flip the card back after 4 seconds
    setTimeout(() => {
      setFlippedCards(prev => ({
        ...prev,
        [cardKey]: false
      }));
    }, 4000);
  };

  const handleTopicClick = (topicId) => {
    setSelectedTopic(selectedTopic === topicId ? null : topicId);
  };

  return (
    <Container maxWidth={false} sx={{ 
      minHeight: '100vh',
      pt: 8,
      mt: 4,
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
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

      {/* Title and Subtitle */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 800,
            fontSize: '3.5rem',
            fontFamily: 'Times New Roman, serif',
            background: 'linear-gradient(135deg, #E6E6FA, #DDA0DD, #FF69B4)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: 'gradient 8s ease infinite',
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
            }
          }}
        >
          Women's Health Insights
        </Typography>
        <Typography
          variant="h5"
          sx={{
            background: 'linear-gradient(135deg, #E6E6FA, #DDA0DD, #FF69B4)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            fontWeight: 500,
            animation: 'gradient 8s ease infinite'
          }}
        >
          Empowering women through knowledge and understanding of their health
        </Typography>
      </Box>

      {/* Horizontal Topic Buttons - First Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 2,
          justifyContent: 'center',
          mb: 3,
          px: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {healthTopics.slice(0, 3).map((topic) => (
          <Box
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              p: 2,
              borderRadius: 2,
              minWidth: 'fit-content',
              border: `1px solid ${alpha(topic.color, 0.3)}`,
              background: selectedTopic === topic.id 
                ? `linear-gradient(135deg, ${alpha(topic.color, 0.3)}, ${alpha(topic.color, 0.2)})`
                : `linear-gradient(135deg, ${alpha(topic.color, 0.1)}, ${alpha(topic.color, 0.05)})`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(topic.color, 0.2)}, ${alpha(topic.color, 0.1)})`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: topic.color,
                textShadow: `0 2px 4px ${alpha(topic.color, 0.3)}`,
                fontSize: '1.2rem',
                fontFamily: 'Times New Roman, serif'
              }}
            >
              {topic.icon} {topic.title}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Horizontal Topic Buttons - Second Row */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 2,
          justifyContent: 'center',
          mb: 6,
          px: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {healthTopics.slice(3).map((topic) => (
          <Box
            key={topic.id}
            onClick={() => handleTopicClick(topic.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              p: 2,
              borderRadius: 2,
              minWidth: 'fit-content',
              border: `1px solid ${alpha(topic.color, 0.3)}`,
              background: selectedTopic === topic.id 
                ? `linear-gradient(135deg, ${alpha(topic.color, 0.3)}, ${alpha(topic.color, 0.2)})`
                : `linear-gradient(135deg, ${alpha(topic.color, 0.1)}, ${alpha(topic.color, 0.05)})`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(topic.color, 0.2)}, ${alpha(topic.color, 0.1)})`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: topic.color,
                textShadow: `0 2px 4px ${alpha(topic.color, 0.3)}`,
                fontSize: '1.2rem',
                fontFamily: 'Times New Roman, serif'
              }}
            >
              {topic.icon} {topic.title}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Topics Content */}
      {selectedTopic && healthTopics.map((topic) => (
        topic.id === selectedTopic && (
          <Box 
            key={topic.id} 
            sx={{ 
              mb: 6,
              background: 'linear-gradient(135deg, rgba(255, 240, 245, 0.5), rgba(255, 228, 225, 0.3))',
              borderRadius: 4,
              border: `2px solid ${alpha(topic.color, 0.3)}`,
              boxShadow: `0 8px 32px ${alpha(topic.color, 0.15)}`,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 4,
                border: `1px solid ${alpha(topic.color, 0.2)}`,
                pointerEvents: 'none'
              }
            }}
          >
            {/* Topic Header */}
            <Box
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, rgba(255, 240, 245, 0.8), rgba(255, 228, 225, 0.6))',
                borderBottom: `2px solid ${alpha(topic.color, 0.2)}`
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  background: 'linear-gradient(135deg, #E6E6FA, #DDA0DD, #FF69B4)',
                  backgroundSize: '200% 200%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontFamily: 'Times New Roman, serif',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  animation: 'gradient 8s ease infinite',
                  textShadow: 'none'
                }}
              >
                {topic.icon} {topic.title}
              </Typography>
            </Box>

            {/* Images Grid */}
            <Box sx={{ p: 4 }}>
              <Grid container spacing={3}>
                {topic.images.map((image, imgIndex) => (
                  <Grid item xs={12} sm={6} md={4} key={imgIndex}>
                    <motion.div
                      style={{
                        perspective: '1000px',
                        cursor: 'pointer',
                        height: 300
                      }}
                      onClick={() => handleCardFlip(topic.id, imgIndex)}
                    >
                      <motion.div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          textAlign: 'center',
                          transition: 'transform 0.6s',
                          transformStyle: 'preserve-3d',
                          transform: flippedCards[`${topic.id}-${imgIndex}`] ? 'rotateY(180deg)' : 'none'
                        }}
                      >
                        {/* Front of card */}
                        <Card
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            borderRadius: 2,
                            border: `1px solid ${alpha(topic.color, 0.3)}`,
                            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, 0.2)}`
                            }
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={image.url}
                            alt={image.info}
                            sx={{
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        </Card>

                        {/* Back of card */}
                        <Card
                          sx={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            borderRadius: 2,
                            border: `1px solid ${alpha('#FFB6C1', 0.5)}`,
                            background: `linear-gradient(135deg, ${alpha('#FFB6C1', 0.95)}, ${alpha('#FFC0CB', 0.85)}, ${alpha('#FFE4E1', 0.75)})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            color: 'white',
                            boxShadow: `0 4px 20px ${alpha('#FFB6C1', 0.3)}`
                          }}
                        >
                          <Typography
                            variant="body1"
                            align="center"
                            sx={{
                              fontWeight: 700,
                              fontFamily: 'Times New Roman, serif',
                              fontSize: '1.1rem',
                              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            {image.info}
                          </Typography>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )
      ))}
    </Container>
  );
};

export default Insights; 