# 🚀 **ERP-CMS Institute Portal Setup Instructions**

## 📋 **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (running locally or cloud instance)
- Cloudinary account (for file uploads)

## 🔧 **Backend Setup**

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Environment Configuration**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your actual values
# At minimum, update these:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a strong secret key)
# - CLOUDINARY credentials (if using Cloudinary)
```

### 3. **Database Setup**
```bash
# Make sure MongoDB is running
# For local MongoDB:
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 4. **Create Admin User**
```bash
# Run the admin setup script
npm run setup-admin
```

**Default Admin Credentials:**
- 📧 **Email:** `admin@institute.edu`
- 🔑 **Password:** `Admin@2024`
- 👤 **Role:** `admin`

## 🎯 **Frontend Setup**

### 1. **Install Dependencies**
```bash
cd frontend
npm install
```

### 2. **Start Development Server**
```bash
npm start
```

## 🔐 **Login Process**

### **For Admin Users:**
1. Navigate to the login page
2. Use the credentials created by the setup script:
   - Email: `admin@institute.edu`
   - Password: `Admin@2024`
3. You'll be redirected to the admin dashboard

### **For Regular Users:**
- Users are added by admins through the admin dashboard
- No public signup available (institute policy)
- Admins can create users with specific roles and branches

## 🛡️ **Security Notes**

### **Immediate Actions After Setup:**
1. ✅ Change the default admin password
2. ✅ Update JWT_SECRET in production
3. ✅ Configure proper MongoDB authentication
4. ✅ Set up HTTPS in production
5. ✅ Remove or secure the setup script

### **Production Checklist:**
- [ ] Strong JWT secret
- [ ] MongoDB authentication enabled
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Environment variables secured
- [ ] Admin setup script removed

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongod --version
# Start MongoDB service
sudo systemctl start mongod
```

#### **2. Port Already in Use**
```bash
# Check what's using port 5000
lsof -i :5000
# Kill the process or change PORT in .env
```

#### **3. JWT Token Issues**
```bash
# Regenerate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Update JWT_SECRET in .env
```

#### **4. Admin Setup Fails**
```bash
# Check MongoDB connection
# Verify User model exists
# Check console for specific error messages
```

## 📱 **Access URLs**

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`
- **Login Page:** `http://localhost:3000/login`

## 🔄 **Development Workflow**

1. **Start Backend:** `npm run dev` (in backend folder)
2. **Start Frontend:** `npm start` (in frontend folder)
3. **Access Admin Dashboard:** Login with admin credentials
4. **Create Users:** Use admin dashboard to add new users
5. **Test Features:** Login as different user types

## 📞 **Support**

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network connectivity for external services

---

**🎉 You're all set! The ERP-CMS Institute Portal is ready to use.**
