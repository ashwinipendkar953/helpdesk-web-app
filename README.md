# Helpdesk Web Application

This Helpdesk Web Application is built with the MERN stack (MongoDB, Express, React, Node.js) and offers role-based functionality for three user types: Customer, Customer Service Agent, and Admin. The application allows users to manage support tickets, add notes/replies, and update ticket statuses, with an intuitive and user-friendly interface.

## Features

### 1. User Roles and Permissions
- **Customer**: 
  - Can register and create an account.
  - Can submit new support tickets and add notes/replies to existing tickets.
  - Can view a list of all their tickets.
  
- **Customer Service Agent**: 
  - Can view all tickets from all customers.
  - Can add notes/replies to any ticket.
  - Can update the status of any ticket.

- **Admin**: 
  - Can view all tickets and manage user profiles.
  - Can add notes/replies and update the status of any ticket.
  - Can access a dashboard with the total count of tickets and customers.

### 2. Ticket Management
- Create, view, and update support tickets.
- Add notes/replies to tickets, with timestamps and user identifiers.
- Track ticket status (Active, Pending, Closed).
- List view for tickets showing Ticket ID, title, status, customer name, and last updated date.

### 3. Dashboard (Admin)
- Displays total number of tickets and customers.

## Technology Stack

- **Frontend**: React (with React Router for navigation, Redux for state management, Bootstrap for styling)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose for schema management)



