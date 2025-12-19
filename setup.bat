@echo off
echo Setting up HomeBuddy project...

echo.
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Failed to install client dependencies
    pause
    exit /b 1
)

echo.
echo Setup complete!
echo.
echo To run the project:
echo 1. Start MongoDB (make sure it's running on localhost:27017)
echo 2. Run 'npm run dev' in the server folder
echo 3. Run 'npm run dev' in the client folder
echo.
pause