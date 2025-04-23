const pool = require('../config/database');
const { queueEmail } = require('./emailService');

// Get user email by ID
const getUserEmail = async (userId) => {
  try {
    const [users] = await pool.execute('SELECT email FROM users WHERE id = ?', [userId]);
    return users.length > 0 ? users[0].email : null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

// Get ticket details by ID
const getTicketDetails = async (ticketId) => {
  try {
    const [tickets] = await pool.execute(`
      SELECT t.*, 
      u1.username as created_by_username, u1.email as created_by_email,
      u2.username as assigned_to_username, u2.email as assigned_to_email,
      u3.username as vendor_admin_username, u3.email as vendor_admin_email,
      u4.username as vendor_employee_username, u4.email as vendor_employee_email
      FROM tickets t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      LEFT JOIN users u3 ON t.vendor_admin_id = u3.id
      LEFT JOIN users u4 ON t.vendor_employee_id = u4.id
      WHERE t.id = ?
    `, [ticketId]);
    
    return tickets.length > 0 ? tickets[0] : null;
  } catch (error) {
    console.error('Error getting ticket details:', error);
    return null;
  }
};

// Notification service methods updated to use queue
exports.notifyTicketCreated = async (ticketId, userId) => {
  try {
    const ticket = await getTicketDetails(ticketId);
    if (!ticket) return false;
    
    // Get project managers to notify
    const [managers] = await pool.execute(
      'SELECT email FROM users WHERE role = ?',
      ['project_manager']
    );
    
    const managerEmails = managers.map(manager => manager.email);
    
    // Queue email to project managers
    if (managerEmails.length > 0) {
      await queueEmail('created', managerEmails, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        createdBy: ticket.created_by_username
      });
    }
    
    // Queue confirmation email to the user who created the ticket
    const userEmail = await getUserEmail(userId);
    if (userEmail) {
      await queueEmail('created', userEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        createdBy: ticket.created_by_username
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in ticket creation notification:', error);
    return false;
  }
};

exports.notifyTicketAssignedToVendorAdmin = async (ticketId, pmId, vendorAdminId) => {
  try {
    const ticket = await getTicketDetails(ticketId);
    if (!ticket) return false;
    
    // Get vendor admin email
    const vendorAdminEmail = await getUserEmail(vendorAdminId);
    
    // Get PM username
    const pmUsername = ticket.assigned_to_username;
    
    // Queue email to vendor admin
    if (vendorAdminEmail) {
      await queueEmail('assigned_pm', vendorAdminEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        vendorAdminName: ticket.vendor_admin_username,
        assignedBy: pmUsername
      });
    }
    
    // Also queue notification for the ticket creator
    const creatorEmail = await getUserEmail(ticket.created_by);
    if (creatorEmail) {
      await queueEmail('assigned_pm', creatorEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        vendorAdminName: ticket.vendor_admin_username,
        assignedBy: pmUsername
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in vendor admin assignment notification:', error);
    return false;
  }
};

exports.notifyTicketAssignedToEmployee = async (ticketId, vendorAdminId, employeeId) => {
  try {
    const ticket = await getTicketDetails(ticketId);
    if (!ticket) return false;
    
    // Get employee email
    const employeeEmail = await getUserEmail(employeeId);
    
    // Queue email to employee
    if (employeeEmail) {
      await queueEmail('assigned_vendor', employeeEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        employeeName: ticket.vendor_employee_username,
        assignedBy: ticket.vendor_admin_username
      });
    }
    
    // Also queue notifications for the ticket creator and project manager
    const creatorEmail = await getUserEmail(ticket.created_by);
    if (creatorEmail) {
      await queueEmail('assigned_vendor', creatorEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        employeeName: ticket.vendor_employee_username,
        assignedBy: ticket.vendor_admin_username
      });
    }
    
    const pmEmail = await getUserEmail(ticket.assigned_to);
    if (pmEmail) {
      await queueEmail('assigned_vendor', pmEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        ticketDescription: ticket.description,
        ticketPriority: ticket.priority,
        employeeName: ticket.vendor_employee_username,
        assignedBy: ticket.vendor_admin_username
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in employee assignment notification:', error);
    return false;
  }
};

exports.notifyTicketResolved = async (ticketId, employeeId, comment) => {
  try {
    const ticket = await getTicketDetails(ticketId);
    if (!ticket) return false;
    
    // Queue notification for the ticket creator to confirm closure
    const creatorEmail = await getUserEmail(ticket.created_by);
    if (creatorEmail) {
      await queueEmail('resolved', creatorEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        resolvedBy: ticket.vendor_employee_username,
        comment: comment || 'No additional comments provided.'
      });
    }
    
    // Also queue notifications for project manager and vendor admin
    const pmEmail = await getUserEmail(ticket.assigned_to);
    if (pmEmail) {
      await queueEmail('resolved', pmEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        resolvedBy: ticket.vendor_employee_username,
        comment: comment || 'No additional comments provided.'
      });
    }
    
    const vendorAdminEmail = await getUserEmail(ticket.vendor_admin_id);
    if (vendorAdminEmail) {
      await queueEmail('resolved', vendorAdminEmail, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        resolvedBy: ticket.vendor_employee_username,
        comment: comment || 'No additional comments provided.'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in ticket resolution notification:', error);
    return false;
  }
};

exports.notifyTicketClosed = async (ticketId, userId, feedback) => {
  try {
    const ticket = await getTicketDetails(ticketId);
    if (!ticket) return false;
    
    // Get user username
    const [users] = await pool.execute('SELECT username FROM users WHERE id = ?', [userId]);
    const username = users.length > 0 ? users[0].username : 'Unknown User';
    
    // Collect all email recipients
    const emails = [
      ticket.created_by_email,
      ticket.assigned_to_email,
      ticket.vendor_admin_email,
      ticket.vendor_employee_email
    ].filter(Boolean);
    
    // Queue notification for all parties involved
    if (emails.length > 0) {
      await queueEmail('closed', emails, {
        ticketId: ticket.id,
        ticketTitle: ticket.title,
        closedBy: username,
        feedback: feedback || 'No feedback provided.'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error in ticket closure notification:', error);
    return false;
  }
};