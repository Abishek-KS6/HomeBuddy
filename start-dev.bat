@echo off
echo Starting HomeBuddy development servers...

echo Starting server...
start "HomeBuddy Server" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting client...
start "HomeBuddy Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers are starting...
echo Server will run on http://localhost:5000
echo Client will run on http://localhost:5173
echo.
pause