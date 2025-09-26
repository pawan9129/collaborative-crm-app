# Backend

This is the backend for the collaborative CRM platform. It is built with Node.js, Express, and Prisma.

## Getting Started

To get started, you will need to have Node.js and PostgreSQL installed on your machine.

1.  Install the dependencies:

```bash
npm install
```

2.  Create a `.env` file in the `backend-dev` directory and add the following environment variables:

```
DATABASE_URL="postgresql://user:password@localhost:5432/crm"
JWT_SECRET="your-jwt-secret"
```

3.  Run the database migrations:

```bash
npx prisma migrate dev
```

4.  Start the server:

```bash
npm start
```

The server will be running on http://localhost:5000.

## API Endpoints

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Login a user.
*   `GET /api/users`: Get all users.
*   `GET /api/leads`: Get all leads.
*   `POST /api/leads`: Create a new lead.
*   `PUT /api/leads/:id`: Update a lead.
*   `DELETE /api/leads/:id`: Delete a lead.
*   `POST /api/activities`: Create a new activity.
