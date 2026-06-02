@echo off
chcp 65001 >nul

echo ================================
echo     Store Server Launcher
echo ================================
echo.
echo  1. Development (npm run dev)
echo  2. Production  (npm run prod)
echo  3. Exit
echo.

set /p choice=Select environment [1-3]:

if "%choice%"=="1" (
    set NODE_ENV=development
    echo.
    echo [Starting] Development mode
    echo ================================
    npm run dev
) else if "%choice%"=="2" (
    set NODE_ENV=production
    echo.
    echo [Starting] Production mode
    echo ================================
    npm run prod
) else if "%choice%"=="3" (
    exit /b
) else (
    echo.
    echo [Error] Invalid choice
    pause
    exit /b 1
)

pause
