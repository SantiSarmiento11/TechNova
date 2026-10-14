@echo off
title TechNova IT Helpdesk - Servidor Web Frontend
echo ===================================================
echo     TechNova IT Helpdesk - Lumina Desk 2.0
echo     Iniciando servidor local en http://localhost:3000
echo ===================================================
echo.
cd /d "%~dp0"
echo Abriendo navegador en http://localhost:3000 ...
start http://localhost:3000
python -m http.server 3000
pause
