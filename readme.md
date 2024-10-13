# Task Management System - Assignment

## Objective

This project is a **Task Management System** implemented as part of a senior software engineer assignment. The system is built using **TypeScript**, **Express.js**, **PostgreSQL** (preferred), and **Pub/Sub** for real-time notifications. It includes task management features with advanced querying capabilities and real-time updates.

## Table of Contents

- [Task Management System - Assignment](#task-management-system---assignment)
  - [Objective](#objective)
  - [Table of Contents](#table-of-contents)
  - [Features Implemented](#features-implemented)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
    - [Tasks API](#tasks-api)
  - [Real-Time Messaging (Pub/Sub)](#real-time-messaging-pubsub)
  - [Additional Features](#additional-features)
  - [How to Run the Project](#how-to-run-the-project)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [Extra](#extra)
    - [Raw queries used to](#raw-queries-used-to)

---

## Features Implemented

1. **Task Management API**:
   - Create and update tasks with project and user assignment.
   - Query tasks based on multiple parameters such as project, user, status, priority, and task comments.
   - Handle complex queries with multi-table joins for efficiency.

2. **Real-Time Notifications**:
   - Real-time notifications triggered when tasks are created or updated.
   - Pub/Sub mechanism to broadcast task changes and notify users.
   
3. **Scheduled Notifications**:
   - Daily notification system for tasks due the next day.
   
4. **Audit Logs**:
   - Tracks task updates and maintains a log of changes.

5. **JWT Authentication**:
   - Secures API access using JWT-based authentication.

---

## Tech Stack

- **TypeScript**: Strongly typed JavaScript for reliability.
- **Express.js**: Web framework for building APIs.
- **PostgreSQL**: Relational database with complex query handling (no ORMs used).
- **Redis Pub/Sub**: Real-time messaging system.
- **Jest**: For unit and integration testing.
- **JWT**: For secure API authentication.

---

## Architecture
- **Controller > Service > Dao**: Controller should only access dao (database layer) through service layer for code decoupling and scalability perspective.

---

## Project Structure

```bash
.
├── src
│   ├── @types              # Node libraries customized
│   ├── controllers         # API controller logic
│   ├── routes              # API route definitions
│   ├── dao                 # Data access object
│   ├── middleware          # Authorization middleware
│   ├── services            # Core business logic
│   ├── utils               # Utilities (e.g., database, Redis)
│   ├── server.ts           # Entry point for the server
│   ├── test                # Unit test
│   ├──── services          # Test case for business logic
├── jest.config.ts          # Jest configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Documentation
```
## API Endpoints

### Tasks API

1. Create Task: `POST /tasks`

- Creates a new task with assigned project and user.
- Sample Request:
  ```bash
  {
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "project_id": "project-uuid",
    "assigned_user_id": "user-uuid",
    "due_date": "2024-10-20"
  }
  ```
2. Update Task: `PUT /tasks/:id`

- Updates task status, priority, or assigned user.
- Sample Request:
  ```bash
  {
    "status": "in_progress",
    "priority": "medium",
    "assigned_user_id": "new_user_id"
  }
  ```

3. Query Tasks: `GET /tasks/query`

- Query tasks with filters by project, user, status, priority, and task due date. Supports searching for tasks containing specific keywords in comments.
- Sample Request:
  ```bash
  curl -X GET 'http://localhost:3000/tasks/query?project_id=project-uuid&status=pending&days=7&keyword=urgent'
  ```

## Real-Time Messaging (Pub/Sub)

- Producer: Publishes messages when tasks are created or updated, broadcasting task information like task ID, status, and user ID.
- Consumer: Consumes these messages and generates notification logs for the assigned user.
- Redis: Redis is used as the Pub/Sub engine to implement real-time messaging.
- Real-Time Example
    - On Task Creation/Update: Task updates trigger messages, which are consumed to create user notifications in real-time.


## Additional Features

- Scheduled Notifications:
    - A daily scheduled job runs to notify users of tasks that are due the next day.
    - Implemented using a cron job or scheduling mechanism.

- Audit Logs:
    - Task updates are recorded in a task_logs table, tracking changes for future reference and auditing.

- Authentication:
    - The system is secured using JWT. All API requests require a valid token.
    - Include the JWT token in the `x-auth-token` header as:
        - `x-auth-token: <your_token>`

- Testing
    - Unit Tests: Written using Jest to cover core functionality and edge cases.
    - Integration Tests: Mock the database and test the API endpoints using supertest.
    - Running Tests
        - Run the tests using the following command: 
          ```bash 
          npm run test
            ```
        - Note: There is only one test case for demonstration.

## How to Run the Project

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- Redis
  
### Setup
1. Clone the repository
    ```bash
    git clone git@github.com:saurabhb44/Task-Management.git
    cd task-management-system
    ```
2. Install the dependencies:
   ```bash
    npm i
    ```
3. Environment variables:
    - I have added .env file with the project for ease. Modify variables according to your requirements.
4. Start the server:
    ```bash
    npm run dev
    ```
5. Use postmant to call APIs
   - I have created a postman collection to be imported from here- 

## Meeting of Acceptance Criteria

### Part 1: Task Management API
- Schema Design: Efficient and optimized for complex relationships involving tasks, users, projects, and comments.
- Advanced Queries: Efficient SQL queries for multi-table joins and filtering tasks based on multiple criteria.
- TypeScript & Input Validation: Proper use of TypeScript features and input validation in all endpoints.

### Part 2: Real-Time Notifications (Pub/Sub)
- Message Producer: Publishes task creation and update messages.
- Message Consumer: Consumes messages and logs notifications for users.
- Error Handling: Includes retries and idempotency to ensure reliability.

### Part 3: Additional Features
- Scheduled Notifications: Daily job to notify users about upcoming tasks.
- Audit Logs: Tracks all task updates.
- JWT Authentication: Ensures secure access to the APIs.

## Conclusion
This project demonstrates the implementation of a Task Management System with real-time updates, advanced querying, scheduled notifications, and audit logging. The architecture and code quality follow industry standards for maintainability and scalability.
```bash
This README is designed to showcase your implementation, highlighting how it meets the criteria of the assignment.
```

## Extra
### Raw queries used to
1. Setting up database (make sure to follow the given sequence)
   1. Users table
        ```bash
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );
        ```
    2. Projects table
        ```bash
        CREATE TABLE projects (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            owner_id UUID REFERENCES users(id)
        );
        ```
    3. Tasks table
        ```bash
        # Create Datatypes
        CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
        ```
        ```bash
        CREATE TABLE tasks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status task_status NOT NULL DEFAULT 'pending',
            priority task_priority NOT NULL DEFAULT 'medium',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            due_date TIMESTAMPTZ,
            project_id UUID REFERENCES projects(id),
            assigned_user_id UUID REFERENCES users(id)
        );
        ```
    4. Comments table
        ```bash
        CREATE TABLE comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID REFERENCES tasks(id),
            author_id UUID REFERENCES users(id),
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ```
    5. Notifications table
        ```bash
        CREATE TABLE notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(id),
            task_id UUID REFERENCES tasks(id),
            message VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ```
    6. Task_logs table
        ```bash
        # Create Datatypes
        CREATE TYPE previous_status AS ENUM('pending', 'in_progress', 'completed');
        CREATE TYPE new_status AS ENUM('pending', 'in_progress', 'completed');
        ```
        ```bash
        CREATE TABLE task_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID REFERENCES tasks(id),
            changed_by UUID REFERENCES users(id),
            previous_status previous_status,
            new_status new_status,
            changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ```
    7. Create indexes for effieient querying on comments table
        ```bash
        CREATE INDEX idx_comments_task_id ON comments(task_id);
        CREATE INDEX idx_comments_content ON comments USING GIN (content gin_trgm_ops);
        ```

2. Querying tasks
   - Complex search query
        ```bash
        SELECT DISTINCT tasks.*
            FROM tasks
            LEFT JOIN comments ON comments.task_id = tasks.id
        AND comments.content ILIKE '%' || $1 || '%' WHERE 1=1 AND tasks.project_id = $2 AND tasks.status = $3 AND tasks.due_date < NOW() + INTERVAL '$9 days' AND comments.id IS NOT NULL
        ```