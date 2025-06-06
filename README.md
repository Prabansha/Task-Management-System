# TaskFlow - Task Management System

A modern, full-stack task management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features include user authentication, role-based access control, drag-and-drop task management, and real-time updates.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based authentication with login/register
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Task Management**: Create, read, update, and delete tasks
- **Drag & Drop**: Intuitive drag-and-drop interface for task status updates
- **Task Filtering**: Filter tasks by status, priority, and assignee
- **Real-time Updates**: Optimistic updates with error handling

### Task Features
- **Status Management**: To Do, In Progress, Done
- **Priority Levels**: Low, Medium, High with visual indicators
- **Due Dates**: Optional due date tracking
- **Task Assignment**: Assign tasks to team members (Admin only)
- **Detailed View**: Comprehensive task details in modal interface

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **React Hook Form** for form handling
- **@dnd-kit** for drag-and-drop functionality
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** for cross-origin requests

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In the server directory, copy the example env file
   cp .env.example .env
   
   # Edit .env with your configuration
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

The system automatically creates demo accounts for testing:

- **Admin Account**
  - Email: admin@demo.com
  - Password: password123
  - Can view all tasks and manage team members

- **User Account**
  - Email: user@demo.com
  - Password: password123
  - Can only view and manage their own tasks

## 📱 Usage

### For Users
1. **Login** with your credentials
2. **View Tasks** assigned to you on the dashboard
3. **Create Tasks** using the "New Task" button
4. **Update Status** by dragging tasks between columns
5. **Edit Tasks** by clicking on them to open the detail modal
6. **Filter Tasks** using the filter options

### For Admins
1. All user capabilities plus:
2. **View All Tasks** across the entire team
3. **Assign Tasks** to any team member
4. **Manage Team Tasks** with full CRUD permissions
5. **Filter by Assignee** to view specific team member tasks

## 🏗️ Project Structure

```
task-management-system/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── ProtectedRoute.tsx   # Route protection
│   │   ├── TaskBoard.tsx        # Drag-and-drop board
│   │   ├── TaskCard.tsx         # Individual task cards
│   │   ├── TaskColumn.tsx       # Status columns
│   │   ├── TaskModal.tsx        # Task creation/editing modal
│   │   ├── TaskFilters.tsx      # Filtering interface
│   │   └── TaskStats.tsx        # Statistics dashboard
│   ├── pages/                   # Page components
│   │   ├── Login.tsx           # Login page
│   │   ├── Register.tsx        # Registration page
│   │   └── Dashboard.tsx       # Main dashboard
│   ├── store/                   # Redux store configuration
│   │   ├── store.ts            # Store setup
│   │   └── slices/             # Redux slices
│   │       ├── authSlice.ts    # Authentication state
│   │       └── taskSlice.ts    # Task management state
│   ├── services/               # API services
│   │   └── api.ts              # API client configuration
│   └── utils/                  # Utility functions
├── server/                      # Backend source code
│   ├── models/                 # MongoDB models
│   │   ├── User.js            # User model
│   │   └── Task.js            # Task model
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── tasks.js          # Task management routes
│   ├── middleware/           # Custom middleware
│   │   └── auth.js          # Authentication middleware
│   └── index.js             # Server entry point
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks (filtered by role)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🎨 Design Features

- **Apple-level Design Aesthetics**: Clean, modern interface with attention to detail
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Consistent Color System**: Professional color palette with proper contrast
- **Typography Hierarchy**: Clear information hierarchy with proper spacing
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: User-friendly error messages and recovery

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Proper authorization checks
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin request handling
- **Token Expiration**: Automatic token refresh handling

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Vercel, Netlify, or any static hosting service:

```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like Heroku, Railway, or any Node.js hosting service. Make sure to:

1. Set environment variables
2. Configure MongoDB connection
3. Update CORS settings for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Redux Toolkit for simplified state management
- @dnd-kit for the excellent drag-and-drop library
- Tailwind CSS for the utility-first CSS framework
- MongoDB team for the robust database solution

---

Built with ❤️ using the MERN stack