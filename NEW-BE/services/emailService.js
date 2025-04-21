const { sendToQueue } = require('../config/rabbitmqConfig');

// Email templates for different ticket status updates (same as before)
const emailTemplates = {
  created: {
    subject: 'New Ticket Created: #{ticketId}',
    body: `
      <h2>New Ticket Created</h2>
      <p>Ticket ##{ticketId}: #{ticketTitle} has been created.</p>
      <p><strong>Description:</strong> #{ticketDescription}</p>
      <p><strong>Priority:</strong> #{ticketPriority}</p>
      <p><strong>Created By:</strong> #{createdBy}</p>
      <p>Please login to the system to view more details.</p>
    `
  },
  assigned_pm: {
    subject: 'Ticket Assigned: #{ticketId}',
    body: `
      <h2>Ticket Assigned to Vendor Admin</h2>
      <p>Ticket ##{ticketId}: #{ticketTitle} has been assigned to vendor admin #{vendorAdminName}.</p>
      <p><strong>Description:</strong> #{ticketDescription}</p>
      <p><strong>Priority:</strong> #{ticketPriority}</p>
      <p><strong>Assigned By:</strong> #{assignedBy}</p>
      <p>Please login to the system to view more details.</p>
    `
  },
  assigned_vendor: {
    subject: 'Ticket Assigned: #{ticketId}',
    body: `
      <h2>Ticket Assigned to Employee</h2>
      <p>Ticket ##{ticketId}: #{ticketTitle} has been assigned to employee #{employeeName}.</p>
      <p><strong>Description:</strong> #{ticketDescription}</p>
      <p><strong>Priority:</strong> #{ticketPriority}</p>
      <p><strong>Assigned By:</strong> #{assignedBy}</p>
      <p>Please login to the system to view more details.</p>
    `
  },
  resolved: {
    subject: 'Ticket Resolved: #{ticketId}',
    body: `
      <h2>Ticket Resolved</h2>
      <p>Ticket ##{ticketId}: #{ticketTitle} has been resolved.</p>
      <p><strong>Resolved By:</strong> #{resolvedBy}</p>
      <p><strong>Resolution Notes:</strong> #{comment}</p>
      <p>Please login to the system to confirm the ticket closure.</p>
    `
  },
  closed: {
    subject: 'Ticket Closed: #{ticketId}',
    body: `
      <h2>Ticket Closed</h2>
      <p>Ticket ##{ticketId}: #{ticketTitle} has been closed.</p>
      <p><strong>Closed By:</strong> #{closedBy}</p>
      <p><strong>Feedback:</strong> #{feedback}</p>
      <p>Thank you for using our ticketing system.</p>
    `
  }
};

// Queue email for sending
const queueEmail = async (emailType, recipients, data) => {
  try {
    // Ensure recipients is an array
    const to = Array.isArray(recipients) ? recipients : [recipients];
    
    // Get template
    const template = emailTemplates[emailType];
    if (!template) {
      throw new Error(`Email template not found: ${emailType}`);
    }
    
    // Create message for queue
    const message = {
      type: emailType,
      template,
      to,
      data
    };
    
    // Send to queue
    return await sendToQueue(message);
  } catch (error) {
    console.error('Error queueing email:', error);
    return false;
  }
};

module.exports = { queueEmail };