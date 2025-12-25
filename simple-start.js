#!/usr/bin/env node

/**
 * 简单启动脚本 - 星励智学平台
 * 基本功能，不包含复杂的环境检查
 */

const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// 获取项目根目录
const projectRoot = __dirname;

// 简单的颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function clearConsole() {
  process.stdout.write('\x1Bc');
}

// 检查依赖是否已安装
function areDependenciesInstalled() {
  return fs.existsSync(path.join(projectRoot, 'node_modules'));
}

// 安装依赖
async function installDependencies() {
  log('正在安装依赖...', 'yellow');
  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    
    npm.on('close', (code) => {
      if (code === 0) {
        log('依赖安装成功!', 'green');
        resolve();
      } else {
        log('依赖安装失败!', 'red');
        reject(new Error(`npm install 退出码: ${code}`));
      }
    });
  });
}

// 启动开发服务器
async function startDevServer() {
  log('正在启动开发服务器...', 'yellow');
  
  // 启动Vite开发服务器
  const vite = spawn('npx', ['vite'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  
  vite.on('close', (code) => {
    if (code !== 0) {
      log(`开发服务器意外退出，退出码: ${code}`, 'red');
    }
  });
  
  return vite;
}

// 主函数
async function main() {
  try {
    clearConsole();
    
    log('================================', 'green');
    log('        星励智学平台启动器', 'green');
    log('================================', 'green');
    log('');
    
    // 检查依赖
    if (!areDependenciesInstalled()) {
      await installDependencies();
    }
    
    // 启动服务器
    const serverProcess = await startDevServer();
    
    // 设置退出处理
    process.on('SIGINT', () => {
      log('\n正在停止服务器...', 'yellow');
      serverProcess.kill('SIGTERM');
      process.exit(0);
    });
    
  } catch (error) {
    log(`启动失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();