@echo off
echo ========================================
echo   Деплой проекта на GitHub Pages
echo ========================================

echo.
echo [1/4] Проверка зависимостей...
call npm install

echo.
echo [2/4] Сборка проекта для production...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ОШИБКА: Сборка не удалась!
    pause
    exit /b 1
)

echo.
echo [3/4] Проверка сборки...
if not exist "build\index.html" (
    echo ОШИБКА: Файл build\index.html не найден!
    pause
    exit /b 1
)

echo.
echo [4/4] Деплой на GitHub Pages...
call npm run deploy

if %ERRORLEVEL% neq 0 (
    echo ОШИБКА: Деплой не удался!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Деплой успешно завершен!
echo ========================================
echo.
echo Ваш сайт доступен по адресу:
echo https://avtanos.github.io/rupio
echo.
echo Для обновления сайта просто запустите этот скрипт снова.
echo.
pause
