const express = require('express');
const ticketController = require('../controllers/ticketController');
const { authMiddleware, roleCheck } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Routes for all authenticated users
router.get('/', ticketController.getMyTickets);
router.get('/:id', ticketController.getTicketById);

// Routes for regular users
router.post('/', ticketController.createTicket);
router.post('/confirm-closure', ticketController.confirmClosure);

// Routes for project managers
router.get('/all',  ticketController.getMyTickets);
router.get('/assigned/myself',  ticketController.getMyAssignedTickets);
router.post('/assign-vendor-admin',  ticketController.assignToVendorAdmin);

// Routes for vendor admins
router.post('/assign-vendor-employee',  ticketController.assignToVendorEmployee);

// Routes for vendor employees
router.post('/resolve', ticketController.resolveTicket);

// Routes for Vendor Admin
router.post('/vendor-admin',  ticketController.projectVendorAdminList);

// Routes for Vendor Admin
router.post('/vendor-employee',  ticketController.projectVendorEmployeeList);
router.get('/ticket/status',  ticketController.ticketStatus);
router.get('/ticket/export',  ticketController.getMyExportTickets);
router.get('/ticket/dashboard-total',  ticketController.dashboardTotal);
router.get('/ticket/dashboard-weekly',  ticketController.dashboardWeekly);
router.get('/ticket/dashboard-monthly',  ticketController.dashboardMonthly);
router.get('/ticket/dashboard-open',  ticketController.dashboardOpen);
router.get('/ticket/dashboard-assign',  ticketController.dashboardAssigned);
router.get('/ticket/dashboard-closed',  ticketController.dashboardClosed);


module.exports = router; 