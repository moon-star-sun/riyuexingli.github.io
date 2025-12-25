#!/usr/bin/env node

/**
 * 星励智学平台统一启动入口
 * 这是用户应该直接调用的脚本
 */

import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES模块中__dirname不可用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确定当前工作目录
const projectRoot = path.resolve(__dirname);
const autoStartScript = path.join(projectRoot, 'scripts', 'auto-start.js');

// 检查脚本是否存在
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