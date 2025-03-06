const express = require('express');
const router = express.Router();
const { setReminder, stopReminder, checkReminder } = require('../controllers/reminderController');
const { sendFollowUpEmail } = require('../services/emailService');

router.post('/set-reminder', setReminder);
router.post('/stop-reminder', stopReminder);
router.get('/check-reminder', checkReminder);

router.post('/send-follow-up-email', async (req, res) => {
  try {
    const { email, activity } = req.body;
    await sendFollowUpEmail(email, activity);
    res.json({ success: true, message: 'Follow-up email sent successfully' });
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    res.status(500).json({ success: false, message: 'Failed to send follow-up email' });
  }
});

module.exports = router; 