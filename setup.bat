@echo off
echo 🚀 Setting up ERP-CMS Educational Portal...
echo ==============================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo 📦 Installing root dependencies...

REM Install root dependencies
npm install

echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

echo 🔧 Creating environment files...

REM Create backend .env file if it doesn't exist
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env" >nul
    echo ✅ Created backend\.env file
    echo ⚠️  Please update backend\.env with your actual credentials
) else (
    echo ✅ backend\.env already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update backend\.env with your MongoDB URI, JWT secret, and Cloudinary credentials
echo 2. Start MongoDB service
echo 3. Run 'npm run dev' to start both frontend and backend
echo.
echo 🔗 URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📚 For more information, check the README.md file
pause
