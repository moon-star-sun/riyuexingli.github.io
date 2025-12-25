#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const colors = require('colors'); // 将使用chalk替代colors，或者自定义颜色函数

/**
 * 依赖管理模块
 * 负责安装和更新项目依赖
 */
class DependencyInstaller {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.packageLockPath = path.join(this.projectRoot, 'package-lock.json');
    this.nodeModulesPath = path.join(this.projectRoot, 'node_modules');
  }

  /**
   * 自定义颜色输出函数
   */
  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    let prefix = '';
    
    switch(type) {
      case 'success':
        prefix = `\x1b[32m[${timestamp}] ✓ \x1b[0m`; // 绿色
        break;
      case 'error':
        prefix = `\x1b[31m[${timestamp}] ✗ \x1b[0m`; // 红色
        break;
      case 'warning':
        prefix = `\x1b[33m[${timestamp}] ⚠ \x1b[0m`; // 黄色
        break;
      case 'info':
      default:
        prefix = `\x1b[36m[${timestamp}] ℹ \x1b[0m`; // 青色
        break;
    }
    
    console.log(`${prefix} ${message}`);
  }

  /**
   * 显示进度条
   */
  showProgress(current, total, message = '') {
    const width = 30;
    const percent = Math.floor((current / total) * 100);
    const filled = Math.floor((width * current) / total);
    const empty = width - filled;
    
    const progressBar = `[${'='.repeat(filled)}${' '.repeat(empty)}] ${percent}%`;
    process.stdout.write(`\r${progressBar} ${message}`);
    
    if (current === total) {
      process.stdout.write('\n');
    }
  }

  /**
   * 执行npm命令并显示进度
   */
  async runNpmCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      this.log(`正在执行: npm ${command} ${args.join(' ')}`, 'info');
      
      const npm = spawn('npm', [command, ...args], {
        cwd: this.projectRoot,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let output = '';
      let errorOutput = '';
      
      npm.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        // 尝试解析npm输出以显示进度
        const lines = text.split('\n');
        for (const line of lines) {
          // 匹配npm的进度输出
          const addedMatch = line.match(/added (\d+) packages/);
          if (addedMatch) {
            const added = parseInt(addedMatch[1]);
            this.showProgress(Math.min(added, 100), 100, '正在下载依赖...');
          }
          
          // 显示其他重要信息
          if (line.trim() && !line.includes('WARN')) {
            console.log(`  ${line.trim()}`);
          }
        }
      });
      
      npm.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        
        // 过滤常见的警告信息
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.trim() && !line.includes('WARN') && !line.includes('deprecated')) {
            console.error(`  \x1b[31m${line.trim()}\x1b[0m`);
          }
        }
      });
      
      npm.on('close', (code) => {
        if (code === 0) {
          this.log(`命令执行成功`, 'success');
          resolve({ success: true, output });
        } else {
          this.log(`命令执行失败，退出码: ${code}`, 'error');
          reject(new Error(errorOutput || `命令执行失败，退出码: ${code}`));
        }
      });
      
      npm.on('error', (error) => {
        this.log(`命令执行错误: ${error.message}`, 'error');
        reject(error);
      });
    });
  }

  /**
   * 检查依赖是否已安装
   */
  areDependenciesInstalled() {
    try {
      // 检查node_modules目录是否存在
      if (!fs.existsSync(this.nodeModulesPath)) {
        return false;
      }

      // 检查package-lock.json是否存在
      if (!fs.existsSync(this.packageLockPath)) {
        return false;
      }

      // 检查主要依赖是否已安装
      const packageJson = require(this.packageJsonPath);
      const mainDeps = Object.keys(packageJson.dependencies || {});
      
      for (const dep of mainDeps) {
        const depPath = path.join(this.nodeModulesPath, dep);
        if (!fs.existsSync(depPath)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.log(`依赖检查出错: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * 安装依赖
   */
  async installDependencies() {
    try {
      this.log('开始安装项目依赖...', 'info');
      
      // 如果已安装，先检查是否需要更新
      if (this.areDependenciesInstalled()) {
        this.log('检测到依赖已存在，检查是否需要更新...', 'info');
        
        try {
          await this.runNpmCommand('outdated');
          this.log('依赖检查完成，但可能存在更新', 'warning');
        } catch (error) {
          // outdated命令会返回非零退出码，这是正常的
          this.log('依赖是最新的，无需更新', 'success');
          return { success: true, message: '依赖已是最新的，无需更新' };
        }
      }
      
      // 清理可能存在的损坏node_modules
      if (fs.existsSync(this.nodeModulesPath) && !this.areDependenciesInstalled()) {
        this.log('检测到损坏的node_modules，正在清理...', 'warning');
        try {
          fs.rmSync(this.nodeModulesPath, { recursive: true, force: true });
          this.log('清理完成', 'success');
        } catch (error) {
          this.log(`清理失败: ${error.message}`, 'error');
        }
      }
      
      // 执行npm install
      this.log('正在执行npm install...', 'info');
      await this.runNpmCommand('install', ['--verbose']);
      
      // 验证安装结果
      if (this.areDependenciesInstalled()) {
        this.log('依赖安装成功！', 'success');
        return { success: true, message: '依赖安装成功' };
      } else {
        throw new Error('依赖安装验证失败');
      }
    } catch (error) {
      this.log(`依赖安装失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 更新依赖
   */
  async updateDependencies() {
    try {
      this.log('开始更新项目依赖...', 'info');
      
      // 备份当前package-lock.json（可选）
      if (fs.existsSync(this.packageLockPath)) {
        const backupPath = `${this.packageLockPath}.backup.${Date.now()}`;
        fs.copyFileSync(this.packageLockPath, backupPath);
        this.log(`已备份package-lock.json到: ${path.basename(backupPath)}`, 'info');
      }
      
      // 执行npm update
      await this.runNpmCommand('update');
      
      this.log('依赖更新完成！', 'success');
      return { success: true, message: '依赖更新成功' };
    } catch (error) {
      this.log(`依赖更新失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 智能安装或更新依赖
   */
  async ensureDependencies() {
    const installed = this.areDependenciesInstalled();
    
    if (!installed) {
      return await this.installDependencies();
    } else {
      // 检查是否需要更新
      try {
        this.log('检查依赖是否需要更新...', 'info');
        await this.runNpmCommand('outdated', ['--json']);
      } catch (error) {
        // 如果有过时依赖，outdated命令会失败，这是正常的
        const output = error.stdout || error.message;
        
        if (output.includes('"current":') && output.includes('"wanted":')) {
          this.log('检测到过时的依赖，正在更新...', 'warning');
          return await this.updateDependencies();
        }
      }
      
      this.log('所有依赖都是最新的', 'success');
      return { success: true, message: '所有依赖都是最新的' };
    }
  }
}

module.exports = DependencyInstaller;