const { body } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('branch')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Branch must be between 2 and 50 characters'),
  
  body('USN')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('USN must be between 5 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('USN can only contain uppercase letters and numbers'),
  
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"')
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('branch')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Branch must be between 2 and 50 characters'),
  
  body('USN')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('USN must be between 5 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('USN can only contain uppercase letters and numbers'),
  
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL')
];

// Validation rules for password change
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation rules for complaint submission
const validateComplaint = [
  body('subject')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Subject must be between 10 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Message must be between 20 and 2000 characters'),
  
  body('category')
    .isIn(['general', 'academic', 'technical', 'facility', 'other'])
    .withMessage('Invalid category selected'),
  
  body('priority')
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean value'),
  
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('isUrgent must be a boolean value'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateComplaint
};
