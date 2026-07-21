@echo off
chcp 65001 >nul
title WristLab 一键启动

echo ================================
echo    WristLab 腕力训练平台启动中...
echo ================================
echo.

REM Kill existing node processes on WristLab ports
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
echo 已清理旧进程

REM Start backend
start "WristLab 后端" /d "%CD%" cmd /c "node server\index.cjs"
echo 后端启动中... (端口 3001)

REM Wait a bit then start frontend
timeout /t 2 /nobreak >nul
start "WristLab 前端" /d "%CD%" cmd /c "node server\frontend.cjs"
echo 前端启动中... (端口 3000)

REM Wait and open browser
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ================================
echo   ✅ 启动完成！浏览器已打开
echo   前端: http://localhost:3000
echo   后端: http://localhost:3001
echo ================================
echo.
echo 关闭此窗口不会停止服务。
echo 各服务窗口可单独关闭。
pause
