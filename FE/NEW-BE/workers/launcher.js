const { startWorker } = require('./emailWorker');

// Start the email worker
startWorker()
  .then(() => {
    console.log('Email worker started successfully');
  })
  .catch((err) => {
    console.error('Failed to start email worker:', err);
    process.exit(1);
  });