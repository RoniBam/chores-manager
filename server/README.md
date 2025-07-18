# Chore Manager - Server Side Implementation

This document provides a comprehensive overview of the server-side implementation of the Chore Manager application, built with Node.js, Express, and SQLite.

## Architecture Overview

The server follows a traditional MVC (Model-View-Controller) pattern with the following structure:

```
server/
├── src/
│   ├── app.js              # Main application entry point
│   ├── models/             # Data layer
│   │   ├── database.js     # Database connection and schema
│   │   ├── Chore.js        # Chore model with CRUD operations
│   │   └── User.js         # User model with CRUD operations
│   ├── routes/             # API endpoints (Controllers)
│   │   ├── chores.js       # Chore-related endpoints
│   │   └── users.js        # User-related endpoints
│   └── middleware/         # Custom middleware (currently empty)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight, file-based database
- **CORS**: Cross-Origin Resource Sharing middleware
- **Body-parser**: Request body parsing middleware
- **UUID**: Unique identifier generation (available but not currently used)

## Database Design

### SQLite Database Schema

The application uses SQLite for data persistence, with the database file automatically created as `database.db` in the project root.

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `name`: User's display name (required)
- `email`: User's email address (optional, must be unique)
- `created_at`: Timestamp of record creation

**Default Data:**
- User 1: Roni (roni@example.com)
- User 2: Arad (arad@example.com)

#### Chores Table
```sql
CREATE TABLE chores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to INTEGER,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users (id)
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `title`: Chore title/name (required)
- `description`: Detailed description (optional)
- `assigned_to`: Foreign key to users table (optional)
- `due_date`: When the chore is due (required)
- `status`: Current status - 'pending', 'in_progress', or 'completed'
- `priority`: Priority level - 'low', 'medium', or 'high'
- `created_at`: Timestamp of record creation
- `updated_at`: Timestamp of last modification

## API Endpoints

### Base URL
All API endpoints are prefixed with `/api`

### Chores Endpoints

#### GET /api/chores
**Description:** Retrieve all chores with assigned user information

**Response:**
```json
[
  {
    "id": 1,
    "title": "Take out trash",
    "description": "Weekly garbage collection",
    "assigned_to": 1,
    "assigned_to_name": "Roni",
    "due_date": "2024-01-15",
    "status": "pending",
    "priority": "medium",
    "created_at": "2024-01-10T10:00:00.000Z",
    "updated_at": "2024-01-10T10:00:00.000Z"
  }
]
```

#### GET /api/chores/:id
**Description:** Retrieve a specific chore by ID

**Parameters:**
- `id` (URL parameter): Chore ID

**Response:** Single chore object or 404 if not found

#### POST /api/chores
**Description:** Create a new chore

**Request Body:**
```json
{
  "title": "Clean kitchen",
  "description": "Deep clean counters and appliances",
  "assigned_to": 2,
  "due_date": "2024-01-20",
  "priority": "high"
}
```

**Required Fields:**
- `title`: String (required)
- `due_date`: Date string in YYYY-MM-DD format (required)

**Optional Fields:**
- `description`: String
- `assigned_to`: Integer (user ID)
- `priority`: String ('low', 'medium', 'high')

**Response:** Created chore object with status 201

#### PUT /api/chores/:id
**Description:** Update an existing chore

**Parameters:**
- `id` (URL parameter): Chore ID

**Request Body:** Same as POST, but all fields are optional except `title` and `due_date`

**Additional Field:**
- `status`: String ('pending', 'in_progress', 'completed')

**Response:** Updated chore object

#### DELETE /api/chores/:id
**Description:** Delete a chore

**Parameters:**
- `id` (URL parameter): Chore ID

**Response:** Success message or 404 if not found

### Users Endpoints

#### GET /api/users
**Description:** Retrieve all users

**Response:**
```json
[
  {
    "id": 1,
    "name": "Roni",
    "email": "roni@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/users/:id
**Description:** Retrieve a specific user by ID

**Parameters:**
- `id` (URL parameter): User ID

**Response:** Single user object or 404 if not found

#### POST /api/users
**Description:** Create a new user

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com"
}
```

**Required Fields:**
- `name`: String (required)

**Optional Fields:**
- `email`: String (must be unique)

**Response:** Created user object with status 201

### Health Check Endpoint

#### GET /api/health
**Description:** Server health check

**Response:**
```json
{
  "status": "OK",
  "message": "Chore Manager API is running"
}
```

## Models Implementation

### Database Connection (database.js)

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../../database.db');
const db = new sqlite3.Database(dbPath);
```

**Features:**
- Automatic database creation if it doesn't exist
- Schema initialization on first run
- Default user data insertion
- Migration support for updating existing records

### Chore Model (Chore.js)

The Chore model provides a clean interface for database operations:

**Methods:**
- `getAll()`: Retrieve all chores with user information via JOIN query
- `getById(id)`: Retrieve specific chore by ID
- `create(choreData)`: Insert new chore record
- `update(id, choreData)`: Update existing chore
- `delete(id)`: Remove chore from database

**Features:**
- Promise-based API for async operations
- Automatic timestamp handling
- JOIN queries to include assigned user names
- Proper error handling

### User Model (User.js)

The User model handles user-related database operations:

**Methods:**
- `getAll()`: Retrieve all users
- `getById(id)`: Retrieve specific user by ID
- `create(userData)`: Insert new user record

**Features:**
- Simple CRUD operations
- Alphabetical sorting by name
- Email uniqueness validation

## Express Application Setup (app.js)

### Middleware Configuration

```javascript
app.use(cors());                                    // Enable CORS
app.use(bodyParser.json());                         // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded requests
```

### Route Registration

```javascript
app.use('/api/chores', choreRoutes);
app.use('/api/users', userRoutes);
```

### Static File Serving

```javascript
app.use(express.static(path.join(__dirname, '../../client/dist')));
```

Serves the built React application from the client/dist directory.

### SPA Fallback

```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

Handles client-side routing by serving the main HTML file for all non-API routes.

## Error Handling

### Database Errors
- All database operations are wrapped in try-catch blocks
- Proper HTTP status codes (404, 500, 400)
- Descriptive error messages returned to client

### Validation
- Required field validation for chores and users
- Foreign key constraint handling
- Input sanitization through Express middleware

## Development vs Production

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Mode
```bash
npm start    # Direct node execution
```

## Security Considerations

### Current Implementation
- CORS enabled for cross-origin requests
- Input validation on required fields
- SQL injection prevention through parameterized queries

### Potential Enhancements
- Rate limiting for API endpoints
- Input sanitization middleware
- Authentication and authorization
- HTTPS enforcement in production
- Environment variable configuration

## Performance Considerations

### Database Optimizations
- Indexed primary keys for fast lookups
- JOIN queries to minimize database calls
- Efficient SQLite queries with proper WHERE clauses

### Memory Management
- Connection pooling (SQLite handles this automatically)
- Proper error handling to prevent memory leaks
- Async/await pattern for non-blocking operations

## Testing the API

### Using curl

**Get all chores:**
```bash
curl http://localhost:3001/api/chores
```

**Create a chore:**
```bash
curl -X POST http://localhost:3001/api/chores \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Chore","due_date":"2024-01-15","priority":"high"}'
```

**Update a chore:**
```bash
curl -X PUT http://localhost:3001/api/chores/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Chore","status":"completed"}'
```

### Using Postman or Similar Tools

1. Import the base URL: `http://localhost:3001/api`
2. Create requests for each endpoint
3. Test with various data combinations
4. Verify error handling with invalid data

## Common Issues and Troubleshooting

### Database Issues
- **File permissions**: Ensure write permissions in the project directory
- **Locked database**: Check for other processes using the database
- **Schema corruption**: Delete `database.db` to recreate

### Server Issues
- **Port conflicts**: Default port 3001 may be in use
- **Module not found**: Run `npm install` in the server directory
- **CORS errors**: Verify CORS middleware is properly configured

### API Issues
- **404 errors**: Check route definitions and URL paths
- **Validation errors**: Ensure required fields are included
- **Foreign key errors**: Verify user IDs exist before assigning chores

## Deployment Considerations

### Environment Variables
Consider using environment variables for:
- Database path
- Server port
- CORS origins
- API keys (if authentication is added)

### Database Backup
- Regular backups of `database.db`
- Migration scripts for schema updates
- Data seeding for production environments

### Monitoring
- Add logging middleware for request/response tracking
- Health check endpoints for monitoring services
- Error reporting and alerting systems

## Future Enhancements

### Planned Features
- User authentication and sessions
- Role-based access control
- Real-time updates via WebSockets
- File upload for chore attachments
- Email notifications for due dates

### Performance Improvements
- Database query optimization
- Caching layer (Redis)
- API rate limiting
- Response compression

### Security Enhancements
- JWT-based authentication
- Input validation middleware
- SQL injection prevention
- XSS protection headers

---

This server implementation provides a solid foundation for the Chore Manager application with clean separation of concerns, proper error handling, and scalable architecture patterns.