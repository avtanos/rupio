@echo off
echo Checking TypeScript compilation...
npx tsc --noEmit
if %errorlevel% equ 0 (
    echo TypeScript compilation successful!
) else (
    echo TypeScript compilation failed!
)
pause
