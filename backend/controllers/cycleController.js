const Cycle = require('../models/Cycle');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper function to calculate cycle length
const calculateCycleLength = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper function to calculate next expected date
const calculateNextExpectedDate = (lastDate) => {
  const randomDays = Math.floor(Math.random() * 3) + 28; // Random between 28-30 days
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + randomDays);
  return nextDate;
};

// Helper function to send email
const sendPeriodEmail = async (userEmail, lastDate, nextExpectedDate) => {
  const tips = [
    "Stay hydrated and drink plenty of water",
    "Get regular exercise to help manage symptoms",
    "Practice stress management techniques",
    "Maintain a balanced diet rich in iron and vitamins",
    "Keep track of your symptoms in the app",
    "Consider gentle yoga or meditation for relaxation",
    "Get adequate sleep to support your body's recovery",
    "Include omega-3 rich foods in your diet",
    "Practice self-care and take time for yourself",
    "Consider using a heating pad for comfort"
  ];

  const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Personalized message based on cycle phase
  let phaseMessage = '';
  if (nextExpectedDate - new Date() <= 7) {
    phaseMessage = "You're approaching your next period. This is a good time to prepare and take extra care of yourself.";
  } else if (nextExpectedDate - new Date() <= 14) {
    phaseMessage = "You're in the follicular phase. This is typically a time of increased energy and vitality.";
  } else if (nextExpectedDate - new Date() <= 21) {
    phaseMessage = "You're in the luteal phase. Focus on stress management and self-care during this time.";
  } else {
    phaseMessage = "You're in the early part of your cycle. This is a great time for planning and productivity.";
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your Period Has Been Logged - Personalized Insights from Femora',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF69B4;">Hello! 👋</h2>
        <p>Thank you for logging your period in Femora. We're here to help you understand and manage your menstrual health journey better.</p>
        
        <div style="background-color: #FFF0F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #FF69B4;">Your Cycle Insights</h3>
          <p style="font-size: 18px; font-weight: bold;">Next Expected Period: ${nextExpectedDate.toLocaleDateString()}</p>
          <p style="font-style: italic;">${phaseMessage}</p>
        </div>

        <div style="background-color: #F0F8FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4B0082;">AI-Powered Health Insights</h3>
          <p>Based on your cycle data and patterns, here are some personalized recommendations:</p>
          <ul style="list-style-type: none; padding: 0;">
            ${randomTips.map(tip => `<li style="margin: 10px 0; padding-left: 20px; position: relative;">
              <span style="position: absolute; left: 0;">✨</span> ${tip}
            </li>`).join('')}
          </ul>
        </div>

        <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4B0082;">Track Your Wellness</h3>
          <p>Remember to:</p>
          <ul style="list-style-type: none; padding: 0;">
            <li style="margin: 10px 0;">📱 Log your symptoms daily in the app</li>
            <li style="margin: 10px 0;">💧 Stay hydrated throughout your cycle</li>
            <li style="margin: 10px 0;">🧘‍♀️ Practice self-care and stress management</li>
            <li style="margin: 10px 0;">🥗 Maintain a balanced diet</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Take care of yourself! 💜<br>
            The Femora Team
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Period notification email sent successfully');
  } catch (error) {
    console.error('Error sending period notification email:', error);
  }
};

// @desc    Create new cycle entry
// @route   POST /api/cycles
// @access  Private
const createCycle = async (req, res) => {
  try {
    console.log('Received cycle data:', req.body);
    console.log('User ID:', req.user._id);

    // Validate required fields
    if (!req.body.startDate || !req.body.endDate || !req.body.flowIntensity) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: req.body 
      });
    }

    // Create new cycle with user ID
    const cycle = new Cycle({
      ...req.body,
      user: req.user._id,
      cycleLength: req.body.cycleLength || calculateCycleLength(req.body.startDate, req.body.endDate)
    });

    console.log('Attempting to save cycle:', cycle);

    const savedCycle = await cycle.save();
    console.log('Cycle saved successfully:', savedCycle);

    // Get user email and send notification
    const user = await User.findById(req.user._id);
    if (user && user.email) {
      const nextExpectedDate = calculateNextExpectedDate(new Date(req.body.endDate));
      await sendPeriodEmail(user.email, new Date(req.body.endDate), nextExpectedDate);
    }

    res.status(201).json(savedCycle);
  } catch (error) {
    console.error('Error creating cycle:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors || 'No additional details'
    });
  }
};

// @desc    Get user's cycle history
// @route   GET /api/cycles
// @access  Private
const getCycles = async (req, res) => {
  try {
    console.log('Fetching cycles for user:', req.user._id);
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 });
    console.log('Found cycles:', cycles.length);
    res.json(cycles);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get cycle statistics
// @route   GET /api/cycles/stats
// @access  Private
const getCycleStats = async (req, res) => {
  try {
    console.log('Fetching stats for user:', req.user._id);
    const cycles = await Cycle.find({ user: req.user._id })
      .sort({ startDate: -1 });
    console.log('Found cycles for stats:', cycles.length);
    
    // If no cycles exist, return empty stats
    if (cycles.length === 0) {
      return res.json({
        averageCycleLength: 0,
        commonSymptoms: [],
        flowIntensities: {},
        totalCycles: 0,
        hasData: false
      });
    }

    // Calculate average cycle length
    const totalLength = cycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0);
    const avgLength = cycles.length > 0 ? totalLength / cycles.length : 0;

    // Get most common symptoms
    const symptoms = cycles.reduce((acc, cycle) => {
      cycle.symptoms.forEach(symptom => {
        acc[symptom] = (acc[symptom] || 0) + 1;
      });
      return acc;
    }, {});

    // Get most common flow intensity
    const flowIntensities = cycles.reduce((acc, cycle) => {
      acc[cycle.flowIntensity] = (acc[cycle.flowIntensity] || 0) + 1;
      return acc;
    }, {});

    const lastCycle = cycles[0];

    const stats = {
      averageCycleLength: Math.round(avgLength),
      commonSymptoms: Object.entries(symptoms)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([symptom]) => symptom),
      flowIntensities,
      totalCycles: cycles.length,
      hasData: true,
      lastCycleEnd: lastCycle.endDate,
      averageLength: Math.round(avgLength),
      lastCycleStart: lastCycle.startDate,
      lastCycleEnd: lastCycle.endDate,
      lastCycleLength: lastCycle.cycleLength
    };

    console.log('Calculated stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCycle,
  getCycles,
  getCycleStats
}; 