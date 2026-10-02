@echo off
echo Installing backend dependencies...
cd server
call npm install
if errorlevel 1 exit /b 1
cd ..
echo Installing frontend dependencies...
cd client
call npm install
if errorlevel 1 exit /b 1
cd ..
echo.
echo Setup complete. Configure server\.env and client\.env before starting.
pause
