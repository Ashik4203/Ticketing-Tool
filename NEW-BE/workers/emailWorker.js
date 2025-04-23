const nodemailer = require('nodemailer');
const amqp = require('amqplib');
const { EMAIL_QUEUE } = require('../config/rabbitmqConfig');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-email-password'     // Replace with your password
  }
});

// Replace placeholders in templates
const formatEmailContent = (template, data) => {
  let subject = template.subject;
  let body = template.body;
  
  // Replace all placeholders with actual data
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`#{${key}}`, 'g');
    subject = subject.replace(regex, data[key]);
    body = body.replace(regex, data[key]);
  });
  
  return { subject, body };
};

// Process messages from queue
const startWorker = async () => {
  try {
    console.log('Starting email worker...');
    
    // Connect to RabbitMQ
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    
    // Make sure the queue exists
    await channel.assertQueue(EMAIL_QUEUE, { durable: true });
    
    // Set prefetch to 1 to ensure fair dispatch
    await channel.prefetch(1);
    
    console.log(`Email worker waiting for messages in ${EMAIL_QUEUE} queue`);
    
    // Consume messages
    channel.consume(EMAIL_QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          // Parse message content
          const content = JSON.parse(msg.content.toString());
          const { type, template, to, data } = content;
          
          console.log(`Processing ${type} email for ${to}`);
          
          // Format email content
          const { subject, body } = formatEmailContent(template, data);
          
          // Send email
          const mailOptions = {
            from: '"Ticketing System" <your-email@example.com>',
            to: Array.isArray(to) ? to.join(',') : to,
            subject,
            html: body
          };
          
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent: %s', info.messageId);
          
          // Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing email message:', error);
          
          // Reject and requeue if it's a transient error
          if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            channel.nack(msg, false, true);
          } else {
            // For permanent errors, reject without requeuing
            channel.nack(msg, false, false);
          }
        }
      }
    });
    
    // Handle connection closure
    process.on('SIGINT', async () => {
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error starting email worker:', error);
    setTimeout(startWorker, 5000); // Try to restart after 5 seconds
  }
};

// Start the worker if this file is executed directly
if (require.main === module) {
  startWorker();
}

module.exports = { startWorker };