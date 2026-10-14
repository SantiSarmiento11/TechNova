@echo off
title TechNova IT Helpdesk - Servidor Web Frontend
echo ===================================================
echo     TechNova IT Helpdesk - Lumina Desk 2.0
echo     Iniciando servidor local en http://localhost:5050
echo ===================================================
echo.
cd /d "%~dp0\frontend"
echo Abriendo navegador en http://localhost:5050 ...
start http://localhost:5050
python -m http.server 5050
pause
