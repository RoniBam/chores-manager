# Chore Manager

A modern, intuitive chore management application built with Node.js, React, and TypeScript. Features both list and calendar views with drag-and-drop functionality for easy task organization.

## Features

### Core Functionality
- **Dual View Modes**: Switch seamlessly between list and calendar views
- **Drag & Drop**: Reorder chores in list view and move them between dates in calendar view
- **Collaborator Assignment**: Assign chores to different family members
- **Priority Levels**: Set and visualize priority levels (High, Medium, Low)
- **Status Tracking**: Mark chores as pending, in progress, or completed

### User Interface
- **Clean, Modern Design**: Built with Tailwind CSS for a responsive, professional look
- **Intuitive Navigation**: Easy switching between views with clear navigation
- **Visual Priority Indicators**: Color-coded priority levels for quick identification
- **Real-time Updates**: Changes reflect immediately across all views

### Technical Features
- **Full-Stack TypeScript**: Type-safe development from frontend to backend
- **RESTful API**: Well-structured API endpoints for all CRUD operations
- **SQLite Database**: Lightweight, file-based database for easy setup
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

### Backend
- **Node.js** with Express framework
- **SQLite3** for database management
- **CORS** for cross-origin resource sharing
- **Body Parser** for request parsing

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **React Big Calendar** for calendar view
- **Axios** for API communication
- **Vite** for fast development and building

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone or download the project**
2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server:dev` - Start only the backend server
- `npm run client:dev` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm start` - Start the production server

## Usage Guide

### Adding Chores
1. Click "Add New Chore" in either view
2. Fill in the chore details:
   - **Title**: Brief description of the chore
   - **Description**: Optional detailed description
   - **Assigned To**: Select a family member
   - **Due Date**: When the chore should be completed
   - **Priority**: Set importance level (High/Medium/Low)
3. Click "Add Chore" to save

### List View Features
- **Drag & Drop**: Click and drag the handle (⋮⋮) to reorder chores
- **Quick Edit**: Click on any chore title to edit it inline
- **Status Toggle**: Check/uncheck the checkbox to mark as complete
- **Filtering**: Use the filter buttons to show All, Pending, or Completed chores
- **Delete**: Click the × button to remove a chore

### Calendar View Features
- **Date Selection**: Click on any date to add a chore for that day
- **Drag Between Dates**: Drag chores between different dates to reschedule
- **Event Details**: Click on any chore to view full details and actions
- **Color Coding**: 
  - Red: High priority
  - Yellow: Medium priority
  - Green: Low priority
  - Gray: Completed chores
- **Multiple Views**: Switch between Month, Week, and Day views

### Collaboration Features
- **User Management**: Pre-configured with "Roni" and "Arad"
- **Assignment**: Assign any chore to any family member
- **Visual Indicators**: See who's assigned to each chore at a glance

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's display name
- `email`: Optional email address
- `created_at`: Timestamp of creation

### Chores Table
- `id`: Primary key
- `title`: Chore title/description
- `description`: Optional detailed description
- `assigned_to`: Foreign key to users table
- `due_date`: Date when chore is due
- `status`: pending, in_progress, or completed
- `priority`: low, medium, or high
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## API Endpoints

### Chores
- `GET /api/chores` - Get all chores
- `GET /api/chores/:id` - Get specific chore
- `POST /api/chores` - Create new chore
- `PUT /api/chores/:id` - Update chore
- `DELETE /api/chores/:id` - Delete chore

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `POST /api/users` - Create new user

## File Structure

```
chore-manager/
├── package.json              # Root package.json with workspace scripts
├── README.md                 # This file
├── database.db              # SQLite database (created automatically)
├── server/                  # Backend application
│   ├── src/
│   │   ├── app.js          # Express server setup
│   │   ├── models/         # Database models
│   │   │   ├── database.js # Database connection and schema
│   │   │   ├── Chore.js    # Chore model
│   │   │   └── User.js     # User model
│   │   └── routes/         # API routes
│   │       ├── chores.js   # Chore endpoints
│   │       └── users.js    # User endpoints
│   └── package.json        # Server dependencies
└── client/                 # Frontend application
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Layout.tsx
    │   │   ├── Navigation.tsx
    │   │   ├── ChoreForm.tsx
    │   │   ├── ChoreItem.tsx
    │   │   └── DraggableChoreItem.tsx
    │   ├── views/          # Page components
    │   │   ├── ListView.tsx
    │   │   └── CalendarView.tsx
    │   ├── contexts/       # React contexts
    │   │   └── ChoreContext.tsx
    │   ├── hooks/          # Custom hooks
    │   │   └── useChores.ts
    │   ├── services/       # API services
    │   │   └── api.ts
    │   ├── types/          # TypeScript types
    │   │   └── index.ts
    │   └── App.tsx         # Main App component
    └── package.json        # Client dependencies
```

## Customization

### Adding New Users
You can add new family members by making a POST request to `/api/users` or by modifying the initial data in `server/src/models/database.js`.

### Styling
The application uses Tailwind CSS. You can customize the appearance by modifying the Tailwind classes in the React components or by updating the `tailwind.config.js` file.

### Database
The SQLite database is automatically created when the server starts. You can view and modify the data using any SQLite browser or command-line tool.

## Troubleshooting

### Common Issues

1. **Port Already in Use**: If ports 3000 or 3001 are already in use, you can change them in:
   - Frontend: `client/vite.config.ts`
   - Backend: `server/src/app.js`

2. **Database Issues**: If you encounter database errors, try deleting the `database.db` file and restarting the server to recreate it.

3. **Build Errors**: Make sure all dependencies are installed with `npm run install:all`.

### Getting Help
- Check the browser console for any JavaScript errors
- Check the server logs for backend errors
- Ensure all dependencies are properly installed

## Future Enhancements

Potential features for future development:
- User authentication and multi-household support
- Recurring chore scheduling
- Email/SMS notifications and reminders
- Mobile app version
- Integration with calendar applications
- Progress tracking and statistics
- Photo attachments for chores
- Reward/point system for completed chores

---

Built with ❤️ for better household organization!