@echo off
echo Building project for GitHub Pages deployment...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing dependencies
        pause
        exit /b 1
    )
)

REM Build the project
echo Building project...
call npm run build
if errorlevel 1 (
    echo Error building project
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo To deploy to GitHub Pages, run:
echo   npm run deploy
echo.
echo Or manually push the build folder to gh-pages branch
echo.
pause
