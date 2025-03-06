const { sendReminderEmail } = require('../services/emailService');

// Store active reminders
const activeReminders = new Map();

const setReminder = async (req, res) => {
  try {
    const { email, items, interval } = req.body;

    // Validate input
    if (!email || !items || !interval) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send initial email
    await sendReminderEmail(email, items, interval);

    // Set up recurring reminders
    const reminderInterval = setInterval(async () => {
      try {
        await sendReminderEmail(email, items, interval);
      } catch (error) {
        console.error('Error sending reminder:', error);
        // Stop sending reminders if there's an error
        clearInterval(reminderInterval);
        activeReminders.delete(email);
      }
    }, interval * 60 * 1000); // Convert minutes to milliseconds

    // Store the interval ID
    activeReminders.set(email, {
      interval: reminderInterval,
      items,
      intervalMinutes: interval
    });

    res.status(200).json({ 
      message: 'Reminder set successfully',
      interval: interval
    });
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ error: 'Failed to set reminder' });
  }
};

const stopReminder = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const reminder = activeReminders.get(email);
    if (reminder) {
      clearInterval(reminder.interval);
      activeReminders.delete(email);
      res.status(200).json({ message: 'Reminders stopped successfully' });
    } else {
      res.status(404).json({ error: 'No active reminders found for this email' });
    }
  } catch (error) {
    console.error('Error stopping reminder:', error);
    res.status(500).json({ error: 'Failed to stop reminder' });
  }
};

const checkReminder = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const reminder = activeReminders.get(email);
    if (reminder) {
      res.status(200).json({
        active: true,
        email,
        interval: reminder.intervalMinutes
      });
    } else {
      res.status(200).json({
        active: false,
        email
      });
    }
  } catch (error) {
    console.error('Error checking reminder:', error);
    res.status(500).json({ error: 'Failed to check reminder status' });
  }
};

module.exports = {
  setReminder,
  stopReminder,
  checkReminder
}; 