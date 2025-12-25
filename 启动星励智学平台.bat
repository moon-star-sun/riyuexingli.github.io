@echo off
chcp 65001 >nul
title 星励智学平台
cls

echo ========================================
echo              星励智学平台启动器
echo ========================================
echo.
echo 正在启动星励智学平台...
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM 检查项目文件是否存在
if not exist "package.json" (
    echo 错误: 未找到项目文件，请确保在正确的目录中运行此脚本
    echo.
    pause
    exit /b 1
)

REM 启动应用程序
node simple-start.js

REM 如果用户退出，保持窗口打开
echo.
echo 应用程序已关闭
echo 按任意键退出...
pause >nul