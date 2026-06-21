# GatherFlow

## Overview

GatherFlow is a digital church event registration and attendee management platform designed to simplify participant onboarding, event pass distribution, and event check-in operations.

The platform enables attendees to register online, receive unique registration IDs and downloadable event passes, while providing organizers with a centralized system to manage registrations and event participation efficiently.

---

## Problem Statement

Traditional event registrations often rely on manual forms, spreadsheets, and paper-based attendee tracking, making event management time-consuming and error-prone.

GatherFlow addresses these challenges by providing a streamlined digital registration experience that improves registration accuracy, reduces administrative effort, and enhances event coordination.

---

## Key Features

* Online attendee registration
* Unique registration ID generation
* Downloadable event registration cards
* Centralized attendee management
* Event check-in support
* Secure user data handling
* Responsive user interface
* Real-time registration workflow

---

## System Architecture

```text
┌─────────────────┐
│     Client      │
│  React Frontend │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Express API   │
│   Node Backend  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │
│   Data Store    │
└─────────────────┘
```

---

## Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* CSS3
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional Tools

* JWT Authentication
* Nodemailer
* Git & GitHub

---

## Project Structure

```text
GatherFlow
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── services
│   │   └── styles
│   └── package.json
│
└── README.md
```

---

## User Workflow

1. Attendee accesses the registration portal.
2. Registration details are submitted.
3. A unique registration ID is generated.
4. A digital event registration card is created.
5. The attendee downloads the registration card.
6. Organizers manage attendee information through the centralized system.
7. Event check-in is completed using the registration details.

---

## Business Value

* Reduces manual paperwork
* Improves registration accuracy
* Simplifies attendee management
* Enhances event coordination
* Provides a seamless registration experience
* Supports efficient event operations

---

## Future Enhancements

* QR Code-based event check-in
* Admin dashboard analytics
* Attendance reporting
* Multi-event support
* SMS and email notifications
* Event capacity management

---

## Author

Abhishek Pabbathi

GitHub: https://github.com/abhishekpabbathi
LinkedIn: https://linkedin.com/in/abhishekpabbathi

```
```
