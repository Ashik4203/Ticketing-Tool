const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with your SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Replace with your email
    pass: 'your-email-password'     // Replace with your password
  }
});

// Email templates for different ticket status updates
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

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const { subject, body } = formatEmailContent(emailTemplates[template], data);
    
    const mailOptions = {
      from: '"Ticketing System" <your-email@example.com>',
      to,
      subject,
      html: body
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };