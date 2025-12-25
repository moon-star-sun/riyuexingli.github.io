@echo off
title 星励智学平台快速启动器
cls

echo ========================================
echo              星励智学平台快速启动器
echo ========================================
echo.
echo 正在启动星励智学平台...
echo.

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
    echo.
)

echo 启动开发服务器...
npm run dev

echo.
echo 按任意键退出...
pause > nul