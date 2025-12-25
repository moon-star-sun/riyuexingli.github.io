#!/usr/bin/env node

/**
 * 星励智学平台统一启动入口
 * 这是用户应该直接调用的脚本
 */

const path = require('path');
const { spawn } = require('child_process');

// 确定当前工作目录
const projectRoot = path.resolve(__dirname);
const autoStartScript = path.join(projectRoot, 'scripts', 'auto-start.cjs');

// 检查脚本是否存在
const fs = require('fs');
if (!fs.existsSync(autoStartScript)) {
  console.error('\x1b[31m错误: 找不到启动脚本，请确保所有文件都正确安装\x1b[0m');
  process.exit(1);
}

// 直接运行自动启动脚本，并传递所有命令行参数
const child = spawn('node', [autoStartScript, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: projectRoot
});

// 处理退出信号
child.on('close', (code) => {
  process.exit(code);
});

// 处理错误
child.on('error', (error) => {
  console.error('\x1b[31m启动错误:', error.message, '\x1b[0m');
  process.exit(1);
});