@echo off
echo Deploying to GitHub Pages...
echo.

REM Install gh-pages if not installed
echo Checking gh-pages installation...
call npm list -g gh-pages >nul 2>&1
if errorlevel 1 (
    echo Installing gh-pages globally...
    call npm install -g gh-pages
    if errorlevel 1 (
        echo Error installing gh-pages
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

REM Deploy to GitHub Pages
echo Deploying to GitHub Pages...
call npm run deploy
if errorlevel 1 (
    echo Error deploying to GitHub Pages
    pause
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo Your site should be available at: https://avtanos.github.io/rupio
echo.
pause
