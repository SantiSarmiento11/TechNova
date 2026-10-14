@echo off
title TechNova IT Helpdesk - Servidor Web Frontend
echo ===================================================
echo     TechNova IT Helpdesk - Lumina Desk UI/UX
echo     Iniciando servidor local en http://localhost:5050
echo ===================================================
echo.
cd /d "%~dp0\frontend"
echo Abriendo navegador en http://localhost:5050/index.html ...
start http://localhost:5050/index.html

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    python -m http.server 5050
) else (
    where npx >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        npx http-server . -p 5050 -c-1 --cors
    ) else (
        echo [INFO] Servidor estatico en puerto 5050. Puede usar Live Server de VS Code.
        pause
    )
)
