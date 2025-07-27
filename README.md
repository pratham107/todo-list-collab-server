
## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### Running the Application

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

The server will start on the specified PORT (default: 3000).

## API Documentation

### Base URL
```
http://localhost:3000
```

## Authentication Routes

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "status": true,
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User logged in successfully",
  "status": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### POST /auth/logout
Logout the current user (clears authentication cookie).

**Response:**
```json
{
  "message": "User logged out successfully",
  "status": true
}
```

### GET /auth/isLoggedIn
Check if user is currently logged in.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User is logged in",
  "status": true,
  "user": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

## Task Routes

**Note:** All task routes require authentication. Include the JWT token in the Authorization header or ensure the token cookie is present.

### POST /todo/add-todo
Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "isPrivate": false
}
```

**Response:**
```json
{
  "message": "Task created successfully",
  "status": true
}
```

### PATCH /todo/edit-todo
Edit an existing task.

**Request Body:**
```json
{
  "id": "task_id",
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "isPrivate": true
}
```

**Response:**
```json
{
  "message": "Task updated successfully",
  "status": true,
  "task": {
    "_id": "task_id",
    "title": "Updated task title",
    "description": "Updated description",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "isPrivate": true,
    "status": "pending",
    "createdBy": "user_id"
  }
}
```

### DELETE /todo/delete-todo
Delete a task.

**Request Body:**
```json
{
  "id": "task_id"
}
```

**Response:**
```json
{
  "message": "Task deleted successfully",
  "status": true
}
```

### PATCH /todo/update-status
Update task status.

**Request Body:**
```json
{
  "id": "task_id",
  "status": "completed"
}
```

**Valid status values:** `pending`, `in-progress`, `completed`

**Response:**
```json
{
  "message": "Task status updated successfully",
  "status": true,
  "task": {
    "_id": "task_id",
    "title": "Task title",
    "description": "Task description",
    "status": "completed",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "isPrivate": false,
    "createdBy": "user_id"
  }
}
```

### GET /todo/all-my-tasks
Get all tasks created by the authenticated user.

**Response:**
```json
{
  "message": "All tasks fetched successfully",
  "status": true,
  "data": [
    {
      "_id": "task_id",
      "title": "My task",
      "description": "Task description",
      "status": "pending",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "isPrivate": false,
      "createdBy": "user_id"
    }
  ]
}
```

### GET /todo/all-other-task
Get all public tasks created by other users.

**Response:**
```json
{
  "message": "Public tasks from other users fetched successfully",
  "status": true,
  "data": [
    {
      "_id": "task_id",
      "title": "Public task",
      "description": "Task description",
      "status": "pending",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "isPrivate": false,
      "createdBy": {
        "_id": "other_user_id",
        "username": "other_user"
      }
    }
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "status": false
}
```

## Security Features

- Password hashing using bcryptjs
- JWT token authentication with 7-day expiration
- HTTP-only cookies for token storage
- User authorization checks for task operations
- Input validation and sanitization

## Database Schema

### User Schema
- `username`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)

### Task Schema
- `title`: String (required)
- `description`: String
- `dueDate`: Date (required, must be in future)
- `status`: String (pending, in-progress, completed)
- `isPrivate`: Boolean (default: false)
- `createdBy`: ObjectId (reference to User)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
