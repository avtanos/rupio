@echo off
echo Building React project...
set CI=false
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo Build completed successfully!
) else (
    echo Build failed with error code %ERRORLEVEL%
)
pause