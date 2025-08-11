<<<<<<< HEAD
# ERP_Application_Final
=======
# ERP-CMS Educational Institute Portal

A comprehensive MERN stack Content Management System (CMS) and Enterprise Resource Planning (ERP) portal designed for educational institutions.

## 🚀 Features

### User Features
- Content browsing and search
- Content upload (pending approval)
- Opportunities viewing
- Complaint submission
- Profile management

### Admin Features
- Content moderation (approve/reject)
- User management (CRUD operations)
- Direct content publishing
- Opportunity posting
- System analytics

### Technical Features
- Role-based authentication (JWT)
- Cloudinary media integration
- Responsive design
- Real-time search
- File upload management

## 🏗️ Architecture

```
ERP-CMS-Final/
├── backend/                 # Node.js + Express + MongoDB
│   ├── config/             # Database, Cloudinary config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, validation middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── public/             # Static assets
│   ├── src/                # React components
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   └── package.json
└── package.json            # Root package.json
```

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT, bcryptjs
- **File Storage**: Cloudinary
- **Database**: MongoDB with Mongoose ODM

## 📋 Development Phases

1. **Phase 1**: Project Setup & Architecture ✅
2. **Phase 2**: Authentication & Authorization
3. **Phase 3**: Cloudinary Integration
4. **Phase 4**: User Dashboard
5. **Phase 5**: Admin Dashboard
6. **Phase 6**: Search & Filtering
7. **Phase 7**: UI/UX & Performance
8. **Phase 8**: Deployment & Testing

## 🚀 Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd ERP-CMS-Final
   npm run install-all
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` in backend folder
   - Fill in your MongoDB URI, JWT secret, and Cloudinary credentials

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Content Management
- `GET /api/content` - Get approved content
- `POST /api/content/upload` - Upload new content
- `PUT /api/content/:id/approve` - Approve content (Admin)
- `DELETE /api/content/:id` - Delete content

### User Management
- `GET /api/users` - Get all users (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Opportunities
- `GET /api/opportunities` - Get opportunities
- `POST /api/opportunities` - Create opportunity (Admin)

### Complaints
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
>>>>>>> 04c83c8 (Initial commit)
