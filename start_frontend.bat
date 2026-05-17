@echo off
echo ==========================================
echo   Manai Mitra - Starting Frontend
echo ==========================================
cd /d "%~dp0frontend"

echo [1/2] Installing dependencies...
call npm install

echo.
echo [2/2] Starting server... (browser opens in 5 seconds)
echo.
echo DO NOT CLOSE THIS WINDOW!
echo The site runs at: http://localhost:5173
echo ==========================================
echo.

start /b "" timeout /t 5 /nobreak >nul & start "" "http://localhost:5173"
call npm run dev
pause
