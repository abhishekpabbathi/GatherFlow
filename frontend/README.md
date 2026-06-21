# GatherFlow

GatherFlow is a MERN stack church registration and user management system. It allows users to register, verify OTP, and lets admins or pastors manage registered users through dashboard pages.

## Features

- User registration
- OTP verification
- Success confirmation page
- Admin login
- Admin dashboard
- User management page
- Pastor dashboard
- REST API backend
- MongoDB database connection
- Rate limiting middleware
- CORS enabled

## Tech Stack

Frontend:
- React.js
- React Router DOM
- Axios
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- Express Validator
- Express Rate Limit

## Folder Structure

```text
GatherFlow
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
└── frontend
    ├── public
    └── src
        ├── pages
        ├── services
        └── App.js