# Movie hub project (backend project)

This project is a Node.js and Express application that provides an API to interact with a movie database. The API supports multiple database configurations using Mongoose with MongoDB, Mongo and Prisma, and Prisma with PostgreSQL.

The application is structured using the Model-View-Controller (MVC) architectural pattern, which organizes the codebase into models, views, and controllers to separate the logic of the application from the user interface and data management.

Before you begin, ensure you have met the following requirements:
- Node.js (version 14 or higher)
- npm (usually comes with Node.js)

Clone the repository and install dependencies: ```npm install```

Create a .env file in the root directory and update it with your database configuration details. 

To start the server, run:
```npm run dev```

## Branches

This project contains several branches, each configured with a different database management system. Here's how to switch between them:

For Mongoose:
```git switch mongoose```

For Mongo with Prisma: 
```git switch mongo_prisma```

For PostgreSQL with Prisma:
```git switch prisma+postgresql```

## Api endpoints
The API supports several endpoints for managing movies. You can find them on Routes folder
  
