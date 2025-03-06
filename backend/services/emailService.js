const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'FemoraSendsLove@gmail.com',
    pass: 'aqtn ctbc jlfc fbfb'
  }
});

const sendReminderEmail = async (toEmail, items, interval) => {
  try {
    const mailOptions = {
      from: 'FemoraSendsLove@gmail.com',
      to: toEmail,
      subject: 'Your Self-Care Reminder from Luna 💕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF1493;">Hello! 🌸</h2>
          <p>This is Luna, reminding you to take a moment for yourself!</p>
          <p>Here are your chosen self-care activities:</p>
          <ul style="list-style-type: none; padding: 0;">
            ${items.map(item => `<li style="margin: 10px 0; padding: 10px; background-color: #FFF0F5; border-radius: 5px;">${item}</li>`).join('')}
          </ul>
          <p>Remember, taking care of yourself is important! 💖</p>
          <p style="color: #666; font-size: 0.9em;">You'll receive another reminder in ${interval} minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendFollowUpEmail = async (toEmail, activity, selectedSuggestion) => {
  try {
    let personalizedMessage = '';
    switch (activity) {
      case 'Warm Comfort':
        personalizedMessage = `I hope you're feeling cozy and relaxed! How was the ${selectedSuggestion}? Remember, taking time for yourself is so important. 💕`;
        break;
      case 'Gentle Movement':
        personalizedMessage = `I hope the gentle movements helped you feel better! How did you find the ${selectedSuggestion}? Movement can be so healing. 🌟`;
        break;
      case 'Mindfulness':
        personalizedMessage = `I hope the mindfulness practice brought you some peace. How was the ${selectedSuggestion}? Taking moments to breathe and reflect is so valuable. 🧘‍♀️`;
        break;
      case 'Comfort Food':
        personalizedMessage = `I hope the comfort food helped lift your spirits! How was the ${selectedSuggestion}? Good food can be such a mood booster. 🍫`;
        break;
      default:
        personalizedMessage = `I hope you're feeling better! How was the ${selectedSuggestion}? Remember, I'm here if you need anything else. 💖`;
    }

    const mailOptions = {
      from: 'FemoraSendsLove@gmail.com',
      to: toEmail,
      subject: 'How are you feeling now? 💕',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF1493;">Hi there! 🌸</h2>
          <p>${personalizedMessage}</p>
          <p>Would you like to try another activity or chat about how you're feeling?</p>
          <p style="color: #666; font-size: 0.9em;">Take care of yourself! 💖</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    throw error;
  }
};

module.exports = {
  sendReminderEmail,
  sendFollowUpEmail
}; 