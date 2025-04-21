const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const EMAIL_QUEUE = 'email_notifications';

// Connect to RabbitMQ and create channel
let channel = null;

const initRabbitMQ = async () => {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(RABBITMQ_URL);
    
    // Create a channel
    channel = await connection.createChannel();
    
    // Assert the queue exists (create if doesn't exist)
    await channel.assertQueue(EMAIL_QUEUE, {
      durable: true // Queue will survive broker restarts
    });
    
    console.log('RabbitMQ connection established');
    
    // Handle connection closure
    connection.on('close', () => {
      console.log('RabbitMQ connection closed, attempting to reconnect...');
      setTimeout(initRabbitMQ, 5000); // Try to reconnect after 5 seconds
    });
    
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      setTimeout(initRabbitMQ, 5000); // Try to reconnect after 5 seconds
    });
    
    return channel;
  } catch (error) {
    console.error('Error initializing RabbitMQ:', error);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(initRabbitMQ, 5000); // Try to reconnect after 5 seconds
  }
};

// Send a message to the queue
const sendToQueue = async (data) => {
  try {
    if (!channel) {
      console.log('Channel not available, initializing RabbitMQ...');
      await initRabbitMQ();
    }
    
    const success = channel.sendToQueue(
      EMAIL_QUEUE,
      Buffer.from(JSON.stringify(data)),
      { persistent: true } // Message will be saved to disk
    );
    
    if (!success) {
      console.log('Queue full or connection issue. Message not queued.');
    } else {
      console.log(`Message added to ${EMAIL_QUEUE} queue`);
    }
    
    return success;
  } catch (error) {
    console.error('Error sending message to queue:', error);
    return false;
  }
};

module.exports = {
  initRabbitMQ,
  sendToQueue,
  EMAIL_QUEUE
};
