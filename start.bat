@echo off
echo 🎬 Starting MovieMania Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Start Backend
echo 🚀 Starting Backend Server...
cd backend

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found. Please copy env.example to .env and configure it.
    echo    copy env.example .env
    echo    Then edit .env with your configuration.
    pause
    exit /b 1
)

REM Install backend dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing backend dependencies...
    npm install
)

REM Start backend in new window
start "MovieMania Backend" cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend
echo 🎨 Starting Frontend Server...
cd ..\frontend

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local file not found. Creating it...
    echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
)

REM Install frontend dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Start frontend in new window
start "MovieMania Frontend" cmd /k "npm run dev"

echo.
echo ✅ MovieMania is starting up!
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close the windows to stop the servers.
echo.
pause
