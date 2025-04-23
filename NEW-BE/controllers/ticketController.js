const { Ticket, User, TicketHistory, Project, ProjectAdminUser, Company, TicketStatus, ProjectVendor, VendorUser } = require('../models');
const notificationService = require('../services/notificationService');
const { Op } = require('sequelize');
const { sequelize } = require('../models'); // 
const { parse } = require('json2csv');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
// Create a new ticket
async function generateTicketId(companyId) {
    const company = await Company.findByPk(companyId);
    const prefix = company.ticket_id_prefix;
    const separator = company.ticket_separator || '-'; // Default to '-' if not set
    const ticketNumberDigit = company.ticket_number_digit || 5; // Default to 5 if not set

    // Get latest ticket for that company
    const lastTicket = await Ticket.findOne({
        where: { company_id: companyId },
        order: [['id', 'DESC']]
    });

    const nextNumber = lastTicket ? lastTicket.id + 1 : 1;
    const paddedNumber = String(nextNumber).padStart(ticketNumberDigit, '0'); // Dynamically pad based on ticket_number_digit

    return `${prefix}${separator}${paddedNumber}`; // e.g., TKT-00001
}

exports.createTicket = async (req, res) => {
    try {
        const { priority, project_id, module, subject, category, source, due_date, behalf_of, attachment, problem_description } = req.body;
        const userId = req.user.id;
        const project = await Project.findByPk(project_id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        const projectAdminUser = await ProjectAdminUser.findOne({
            where: { project_id, status: 'active' }
        });
        if (!projectAdminUser) return res.status(404).json({ error: 'Project Admin Not found This Project' });


        const ticket = await Ticket.create({
            project_id,
            module,
            subject,
            category,
            source,
            due_date,
            behalf_of,
            attachment,
            priority,
            problem_description,
            created_by: userId,
            status_id: 1,
            company_id: req.user.company_id,
            assigned_to: projectAdminUser.user_id,
            ticket_id: await generateTicketId(req.user.company_id),
        });

        await TicketHistory.create({
            ticket_id: ticket.id,
            user_id: userId,
            action: 'created',
            comment: `Ticket created with ID: ${ticket.id}`,
        });

        await notificationService.notifyTicketCreated(ticket.id, userId);
        res.status(201).json({ message: 'Ticket created successfully', ticketId: ticket.id });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ message: 'Error creating ticket' });
    }
};

// Get tickets for the authenticated user with pagination
exports.getMyTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const key = req.query.key; // Read the key param
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Conditionally apply "created_by" filter
        const whereClause = key === 'all' ? {} : { created_by: userId };

        const { count, rows } = await Ticket.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            offset,
            limit,
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name'],
                    as: 'project'
                },
                {
                    model: TicketStatus,
                    attributes: ['id', 'status', 'status_text'],
                    as: 'ticketsStatus'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'createdBy'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'assignedTo'
                }
            ]
        });

        res.json({
            total: count,
            page,
            perPage: limit,
            tickets: rows.map(ticket => ({
                ...ticket.toJSON(),
                project_id: ticket.project?.id,
                project_name: ticket.project?.name,
                status_id: ticket.ticketsStatus?.id,
                status: ticket.ticketsStatus?.status,
                created_by_name: ticket.createdBy?.name,
                assigned_to_name: ticket.assignedTo?.name || null
            })),
        });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
};

exports.getMyAssignedTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const key = req.query.key;
        const exportType = req.query.export; // 'filtered' or 'all'

        let whereClause = {};

        // Apply role-based filtering unless export=all
        if (key !== 'all' && exportType !== 'all') {
            if (role === 3) {
                whereClause.assigned_to = userId;
            } else if (role === 4) {
                whereClause.vendor_admin_id = userId;
            } else if (role === 5) {
                whereClause.vendor_employee_id = userId;
            } else {
                whereClause.created_by = userId;
            }
        }

        // Filters only when export is not 'all'
        if (exportType !== 'all') {
            const filterableFields = ['project_id', 'module', 'category', 'source', 'priority', 'status_id'];
            filterableFields.forEach(field => {
                if (req.query[field]) {
                    whereClause[field] = req.query[field];
                }
            });

            // Search only if exporting filtered data
            if (req.query.search) {
                const searchTerm = req.query.search;
                whereClause[Op.or] = [
                    { subject: { [Op.like]: `%${searchTerm}%` } },
                    { problem_description: { [Op.like]: `%${searchTerm}%` } },
                    { ticket_id: { [Op.like]: `%${searchTerm}%` } },
                    { behalf_of: { [Op.like]: `%${searchTerm}%` } }
                ];
            }
        }

        // Only apply pagination if not exporting
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const pagination = exportType ? {} : { limit, offset };

        const { count, rows } = await Ticket.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            ...pagination,
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name'],
                    as: 'project'
                },
                {
                    model: TicketStatus,
                    attributes: ['id', 'status', 'status_text'],
                    as: 'ticketsStatus'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'createdBy'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'assignedTo'
                }
            ]
        });

        res.json({
            total: count,
            page,
            perPage: limit,
            tickets: rows.map(ticket => ({
                ...ticket.toJSON(),
                project_id: ticket.project?.id,
                project_name: ticket.project?.name,
                status_id: ticket.ticketsStatus?.id,
                status: ticket.ticketsStatus?.status,
                created_by_name: ticket.createdBy?.name,
                assigned_to_name: ticket.assignedTo?.name || null
            })),
        });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
};


exports.getMyExportTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const key = req.query.key;
        const exportType = req.query.export; // 'filtered' or 'all'

        let whereClause = {};

        // Apply role-based filtering unless export=all
        if (key !== 'all' && exportType !== 'all') {
            if (role === 3) {
                whereClause.assigned_to = userId;
            } else if (role === 4) {
                whereClause.vendor_admin_id = userId;
            } else if (role === 5) {
                whereClause.vendor_employee_id = userId;
            } else {
                whereClause.created_by = userId;
            }
        }

        // Filters only when export is not 'all'
        if (exportType !== 'all') {
            const filterableFields = ['project_id', 'module', 'category', 'source', 'priority', 'status_id'];
            filterableFields.forEach(field => {
                if (req.query[field]) {
                    whereClause[field] = req.query[field];
                }
            });

            // Search only if exporting filtered data
            if (req.query.search) {
                const searchTerm = req.query.search;
                whereClause[Op.or] = [
                    { subject: { [Op.like]: `%${searchTerm}%` } },
                    { problem_description: { [Op.like]: `%${searchTerm}%` } },
                    { ticket_id: { [Op.like]: `%${searchTerm}%` } },
                    { behalf_of: { [Op.like]: `%${searchTerm}%` } }
                ];
            }
        }

        const { count, rows } = await Ticket.findAndCountAll({
            where: whereClause,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name'],
                    as: 'project'
                },
                {
                    model: TicketStatus,
                    attributes: ['id', 'status', 'status_text'],
                    as: 'ticketsStatus'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'createdBy'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'assignedTo'
                }
            ]
        });
        const exportsDir = path.join(__dirname, "../exports");

        // Create the directory if it doesn't exist
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
        }
        // Generate Excel file using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tickets');

        // Define columns for Excel sheet
        worksheet.columns = [
            { header: 'Ticket ID', key: 'ticket_id' },
            { header: 'Project Name', key: 'project_name' },
            { header: 'Status', key: 'status' },
            { header: 'Created By', key: 'created_by' },
            { header: 'Assigned To', key: 'assigned_to' },
            { header: 'Subject', key: 'subject' },
            { header: 'Description', key: 'description' }
        ];

        // Add rows to the Excel file
        rows.forEach(ticket => {
            worksheet.addRow({
                ticket_id: ticket.ticket_id,
                project_name: ticket.project?.name,
                status: ticket.ticketsStatus?.status,
                created_by: ticket.createdBy?.name,
                assigned_to: ticket.assignedTo?.name || null,
                subject: ticket.subject,
                description: ticket.problem_description
            });
        });

        const filePath = path.join(__dirname, "../exports", "tickets.xlsx");

        // Save the Excel file to the server
        await workbook.xlsx.writeFile(filePath);
        const downloadLink = `${req.protocol}://${req.get('host')}/exports/tickets.xlsx`;
        // Send the file path in the response
        res.json({
            downloadLink: downloadLink, // Adjust the path if needed
        });

    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
};



// Get a single ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        console.log('Assigning ticket to vendor admin...');
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const ticket = await Ticket.findByPk(id, {

            include: [
                {
                    model: Project,
                    attributes: ['id', 'name'],
                    as: 'project'
                },
                {
                    model: TicketStatus,
                    attributes: ['id', 'status', 'status_text'],
                    as: 'ticketsStatus'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'createdBy'
                },
                {
                    model: User,
                    attributes: ['name'],
                    as: 'assignedTo'
                }
            ]
        });

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (userRole === 'user' && ticket.created_by !== userId)
            return res.status(403).json({ message: 'Access denied' });

        const history = await TicketHistory.findAll({
            where: { ticket_id: id },
            include: [{ model: User, attributes: ['username'] }],
            order: [['created_at', 'ASC']]
        });

        res.json({ ticket, history });
    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ message: 'Error fetching ticket' });
    }
};

// Assign ticket to vendor admin
exports.assignToVendorAdmin = async (req, res) => {
    try {

        const { ticketId, vendorAdminId, statusId, comment } = req.body;
        const userId = req.user.id;

        const vendorAdmin = await User.findOne({ where: { id: vendorAdminId } });
        if (!vendorAdmin) return res.status(400).json({ message: 'Invalid vendor admin' });

        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.vendor_admin_id = vendorAdminId;
        ticket.status_id = statusId;
        await ticket.save();
        if (statusId === 2) {
            await TicketHistory.create({
                ticket_id: ticketId,
                user_id: userId,
                action: `Assigned to vendor admin : ${vendorAdmin.name}`,
                comment: comment,
            });

        } else if (statusId === 7) {
            await TicketHistory.create({
                ticket_id: ticketId,
                user_id: userId,
                action: 'Project Admin Rejected',
                comment: comment,
            });
        }


        //await notificationService.notifyTicketAssignedToVendorAdmin(ticketId, userId, vendorAdminId);

        res.json({ message: 'Ticket assigned to vendor admin successfully' });
    } catch (error) {
        console.error('Assign error:', error);
        res.status(500).json({ message: 'Error assigning ticket' });
    }
};

// Assign ticket to vendor employee
exports.assignToVendorEmployee = async (req, res) => {
    try {
        const { ticketId, vendorEmployeeId, comment } = req.body;
        const userId = req.user.id;

        const ticket = await Ticket.findOne({
            where: { id: ticketId, vendor_admin_id: userId }
        });
        if (!ticket) return res.status(403).json({ message: 'Not authorized' });

        const employee = await User.findOne({ where: { id: vendorEmployeeId } });
        if (!employee) return res.status(400).json({ message: 'Invalid vendor employee' });

        ticket.vendor_employee_id = vendorEmployeeId;
        ticket.status_id = 3;
        await ticket.save();

        await TicketHistory.create({
            ticket_id: ticketId,
            user_id: userId,
            action: `Assigned to vendor employee ID: ${vendorEmployeeId}`,
            comment: comment || 'Ticket assigned to vendor employee',
        });

        await notificationService.notifyTicketAssignedToEmployee(ticketId, userId, vendorEmployeeId);

        res.json({ message: 'Ticket assigned to vendor employee successfully' });
    } catch (error) {
        console.error('Assign to employee error:', error);
        res.status(500).json({ message: 'Error assigning ticket to employee' });
    }
};

// Mark ticket as resolved
exports.resolveTicket = async (req, res) => {
    try {
        const { ticketId, comment, statusId } = req.body;
        const userId = req.user.id;

        const ticket = await Ticket.findOne({
            where: { id: ticketId, vendor_employee_id: userId }
        });

        if (!ticket) return res.status(403).json({ message: 'Not authorized' });

        ticket.status_id = statusId;
        await ticket.save();
        const ticketStatus = await TicketStatus.findOne({
            where: { id: statusId }
        });
        await TicketHistory.create({
            ticket_id: ticketId,
            user_id: userId,
            action: ticketStatus.status_text,
            comment: comment || 'Ticket has been resolved',
        });

        //await notificationService.notifyTicketResolved(ticketId, userId, comment);

        res.json({ message: 'Ticket Status has been changed' });
    } catch (error) {
        console.error('Resolve error:', error);
        res.status(500).json({ message: 'Error resolving ticket' });
    }
};


// Confirm ticket closure
exports.confirmClosure = async (req, res) => {
    try {
        const { ticketId, feedback, statusId } = req.body;
        const userId = req.user.id;

        const ticket = await Ticket.findOne({
            where: { id: ticketId, created_by: userId, status_id: 6 }
        });

        if (!ticket) return res.status(403).json({ message: 'Not authorized or ticket not resolved' });

        ticket.status_id = statusId;
        await ticket.save();

        await TicketHistory.create({
            ticket_id: ticketId,
            user_id: userId,
            action: 'closed',
            comment: feedback || 'Ticket closure confirmed by user',
        });

        //await notificationService.notifyTicketClosed(ticketId, userId, feedback);

        res.json({ message: 'Ticket closed successfully' });
    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'Error closing ticket' });
    }
};

exports.projectVendorAdminList = async (req, res) => {
    try {
        const { project_id } = req.body;
        if (!project_id) return res.status(403).json({ message: 'Project is Missing' });
        const users = await User.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: VendorUser,
                    as: 'vendorUsers',
                    required: true,
                    where: {
                        vendor_admin_id: null
                    },
                    include: [
                        {
                            model: ProjectVendor,
                            as: 'projectVendor',
                            required: true,
                            where: {
                                project_id: project_id
                            }
                        }
                    ]
                }
            ]
        });
        if (!users) return res.status(403).json({ message: 'Vendor Admin is not mapped' });

        res.json({ message: 'Vendor Admin List', data: users });

    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching Vendor admin ticket' });
    }
};

exports.projectVendorEmployeeList = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await User.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: VendorUser,
                    as: 'vendorUsers',
                    where: { vendor_admin_id: userId },
                    attributes: [], // We only want fields from `User`, so we ignore nested attributes
                    required: true  // Ensures it works like an INNER JOIN
                }
            ]
        });
        if (!users) return res.status(403).json({ message: 'Vendor Employee is not mapped' });

        res.json({ message: 'Vendor Employee List', data: users });

    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching Vendor admin ticket' });
    }
};
exports.ticketStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const ticketStatus = await TicketStatus.findAll();
        if (!ticketStatus) return res.status(403).json({ message: 'Ticket Status not found' });

        res.json({ message: 'Ticket Status', data: ticketStatus });

    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching ticketStatus' });
    }
};

exports.dashboardTotal = async (req, res) => {
    try {
        const totalTickets = await Ticket.count();
        res.json({ totalTickets });
    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching ticketStatus' });
    }
};
exports.dashboardWeekly = async (req, res) => {
    try {
        const weeklyTickets = await Ticket.findAll({
            attributes: [
                [sequelize.fn("DAYOFWEEK", sequelize.col("created_at")), "day"],
                [sequelize.fn("COUNT", sequelize.col("ticket_id")), "tickets"],
            ],
            group: ["day"],
            order: [[sequelize.fn("DAYOFWEEK", sequelize.col("created_at")), "ASC"]],
        });
        res.json(weeklyTickets);
    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching ticketStatus' });
    }
};

exports.dashboardMonthly = async (req, res) => {
    try {
        const monthlyTickets = await Ticket.findAll({
            attributes: [
                [sequelize.fn("DAY", sequelize.col("created_at")), "day"],
                [sequelize.fn("COUNT", sequelize.col("ticket_id")), "tickets"],
            ],
            group: ["day"],
            order: [[sequelize.fn("DAY", sequelize.col("created_at")), "ASC"]],
        });
        res.json(monthlyTickets);
    } catch (error) {
        console.error('Closure error:', error);
        res.status(500).json({ message: 'fetching ticketStatus' });
    }
};

exports.dashboardOpen = async (req, res) => {
  try {
    const openTickets = await Ticket.count({
      where: {
        status_id: {
          [Op.in]: [1, 2, 3, 4] // Using `IN` condition with sequelize operator
        }
      }
    });

    res.json({count:openTickets});

  } catch (error) {
    console.error('Closure error:', error);
    res.status(500).json({ message: 'Error fetching open ticket status' });
  }
};

exports.dashboardClosed = async (req, res) => {
  try {
    const closedTickets = await Ticket.count({
      where: {
        status_id: {
          [Op.in]: [5, 6] // Using `IN` condition with sequelize operator for closed tickets
        }
      }
    });

    res.json({count:closedTickets});

  } catch (error) {
    console.error('Closure error:', error);
    res.status(500).json({ message: 'Error fetching closed ticket status' });
  }
};

