@echo off
echo Starting EcoFinds MVP Setup with MySQL...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo Installing dependencies...

REM Install root dependencies
call npm install

REM Install server dependencies
cd server
call npm install

REM Install client dependencies
cd ..\client
call npm install

echo 🌱 Setting up environment...
cd ..\server

REM Create .env if it doesn't exist
if not exist .env (
    echo NODE_ENV=development > .env
    echo PORT=5000 >> .env
    echo JWT_SECRET=ecofinds_super_secret_key_%random% >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo.>> .env
    echo # MySQL Database Configuration >> .env
    echo DB_HOST=localhost >> .env
    echo DB_PORT=3306 >> .env
    echo DB_NAME=ecofinds_dev >> .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD= >> .env
    echo DB_NAME_TEST=ecofinds_test >> .env
    echo.>> .env
    echo # Security Settings >> .env
    echo BCRYPT_ROUNDS=12 >> .env
    echo RATE_LIMIT_WINDOW=15 >> .env
    echo RATE_LIMIT_MAX=100 >> .env
    echo.>> .env
    echo # File Upload Settings >> .env
    echo MAX_FILE_SIZE=5242880 >> .env
    echo UPLOAD_PATH=uploads >> .env
    echo 📝 Created .env file
)

echo 🗄️ Setting up MySQL database...
echo Please ensure MySQL is running and create the database:
echo   CREATE DATABASE ecofinds_dev;
echo   CREATE DATABASE ecofinds_test;
echo.
echo Or run: mysql -u root -p -e "CREATE DATABASE ecofinds_dev; CREATE DATABASE ecofinds_test;"

echo 🎯 Running database migrations and seeding...
call npm run db:setup

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo    Terminal 1: cd server && npm run dev
echo    Terminal 2: cd client && npm run dev
echo.
echo 📖 Demo credentials:
echo    Email: demo@ecofinds.com
echo    Password: Demo123!
echo.
echo 🔧 Make sure to configure your MySQL connection in server/.env
echo    Default: localhost:3306, database: ecofinds_dev, user: root
