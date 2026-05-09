@echo off
echo ==========================================
echo   Manai Mitra - Frontend Setup
echo ==========================================
cd /d "%~dp0frontend"
echo Installing dependencies...
npm install
echo.
echo Starting dev server on http://localhost:5173
npm run dev
pause
