@echo off
chcp 65001 >nul
title Kodatrix - Baslatici
echo ==========================================
echo   KODATRIX - Tum Servisler Baslatiliyor
echo ==========================================
echo.
echo   Backend API   : http://localhost:3000
echo   Ana Site      : http://localhost:3001
echo   Admin Panel   : http://localhost:3002
echo.
echo   Kapatmak icin bu pencerede Ctrl+C ya da
echo   her terminal penceresini kapatabilirsiniz.
echo ==========================================
echo.

start "Kodatrix Backend (API)" cmd /k "cd /d "%~dp0kodatrix-backend" && node server.js"
timeout /t 2 /nobreak >nul
start "Kodatrix Ana Site" cmd /k "cd /d "%~dp0kodatrix-site" && npm run dev"
timeout /t 2 /nobreak >nul
start "Kodatrix Admin Panel" cmd /k "cd /d "%~dp0kodatrix-admin" && npm run dev"
timeout /t 5 /nobreak >nul

start http://localhost:3001
start http://localhost:3002

echo Tum servisler baslatildi!
echo Bu pencereyi kapatabilirsiniz.
timeout /t 3 >nul