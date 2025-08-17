const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// Default admin credentials
const DEFAULT_ADMIN = {
  name: 'Institute Admin',
  email: 'admin@institute.edu',
  password: 'Admin@2024',
  role: 'admin',
  branch: 'Administration',
  USN: '1AD22AD001',
  isActive: true
};

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/erp_cms_institute');
    console.log('✅ Connected to MongoDB successfully!');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`🔑 Password: ${DEFAULT_ADMIN.password}`);
      console.log(`👤 Role: ${existingAdmin.role}`);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, saltRounds);

    // Create admin user
    const adminUser = new User({
      ...DEFAULT_ADMIN,
      password: hashedPassword
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 **ADMIN LOGIN CREDENTIALS**');
    console.log('================================');
    console.log(`📧 Email: ${DEFAULT_ADMIN.email}`);
    console.log(`🔑 Password: ${DEFAULT_ADMIN.password}`);
    console.log(`👤 Role: ${DEFAULT_ADMIN.role}`);
    console.log(`🏢 Branch: ${DEFAULT_ADMIN.branch}`);
    console.log('================================');
    console.log('\n⚠️  **IMPORTANT**: Change these credentials after first login!');
    console.log('🔒 Store these credentials securely and delete this script in production.');

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
  }
};

// Run the setup
if (require.main === module) {
  setupAdmin();
}

module.exports = setupAdmin;
