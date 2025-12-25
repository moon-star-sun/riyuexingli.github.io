#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

/**
 * 开发服务器启动模块
 * 负责启动Vite开发服务器并自动打开浏览器
 */
class DevServerStarter {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.defaultPort = 5173;
    this.host = '0.0.0.0';
    this.serverProcess = null;
    this.browserOpened = false;
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
   * 检查端口是否被占用
   */
  isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => {
          resolve(true);
        });
        server.close();
      });
      
      server.on('error', () => {
        resolve(false);
      });
    });
  }

  /**
   * 查找可用端口
   */
  async findAvailablePort(startPort = this.defaultPort) {
    let port = startPort;
    const maxPort = startPort + 10; // 最多检查10个端口
    
    while (port <= maxPort) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
      port++;
    }
    
    throw new Error(`无法找到可用端口，已检查 ${startPort} 到 ${maxPort}`);
  }

  /**
   * 获取网络IP地址
   */
  getNetworkIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // 跳过内部地址和非IPv4地址
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
    
    return '127.0.0.1'; // 默认回环地址
  }

  /**
   * 自动打开浏览器
   */
  async openBrowser(url) {
    if (this.browserOpened) {
      return { success: true, message: '浏览器已经打开' };
    }

    const platform = process.platform;
    let command;
    
    switch (platform) {
      case 'darwin': // macOS
        command = `open "${url}"`;
        break;
      case 'win32': // Windows
        command = `start "" "${url}"`;
        break;
      default: // Linux
        command = `xdg-open "${url}"`;
        break;
    }
    
    return new Promise((resolve, reject) => {
      const child = spawn(command, { shell: true });
      
      child.on('close', (code) => {
        if (code === 0) {
          this.browserOpened = true;
          this.log(`浏览器已打开: ${url}`, 'success');
          resolve({ success: true, message: `浏览器已打开: ${url}` });
        } else {
          this.log(`打开浏览器失败，退出码: ${code}`, 'error');
          this.log(`请手动访问: ${url}`, 'info');
          resolve({ 
            success: false, 
            message: `打开浏览器失败，请手动访问: ${url}` 
          });
        }
      });
      
      child.on('error', (error) => {
        this.log(`打开浏览器出错: ${error.message}`, 'error');
        this.log(`请手动访问: ${url}`, 'info');
        resolve({ 
          success: false, 
          message: `打开浏览器出错，请手动访问: ${url}` 
        });
      });
    });
  }

  /**
   * 启动开发服务器
   */
  async startDevServer(options = {}) {
    const {
      port = this.defaultPort,
      host = this.host,
      open = true,
      clearConsole = true
    } = options;

    try {
      if (clearConsole) {
        console.clear();
      }

      this.log('正在启动星励智学平台开发服务器...', 'info');
      
      // 检查可用端口
      const availablePort = await this.findAvailablePort(port);
      if (availablePort !== port) {
        this.log(`端口 ${port} 被占用，使用端口 ${availablePort}`, 'warning');
      }
      
      // 构建服务器URL
      const networkIP = this.getNetworkIP();
      const localURL = `http://localhost:${availablePort}`;
      const networkURL = `http://${networkIP}:${availablePort}`;
      
      this.log('正在启动Vite开发服务器...', 'info');
      
      // 启动Vite开发服务器
      this.serverProcess = spawn('npx', ['vite'], {
        cwd: this.projectRoot,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          HOST: host,
          PORT: availablePort.toString()
        }
      });
      
      let serverReady = false;
      let serverError = '';
      
      // 处理服务器输出
      this.serverProcess.stdout.on('data', (data) => {
        const text = data.toString();
        console.log(text);
        
        // 检查服务器是否已准备好
        if (text.includes('Local:') || text.includes('ready in')) {
          serverReady = true;
          
          // 显示访问地址
          this.log('服务器已启动！', 'success');
          console.log(`\x1b[32m➜ 本地访问: \x1b[36m${localURL}\x1b[0m`);
          console.log(`\x1b[32m➜ 网络访问: \x1b[36m${networkURL}\x1b[0m`);
          
          // 自动打开浏览器
          if (open) {
            setTimeout(async () => {
              await this.openBrowser(localURL);
            }, 1000);
          }
        }
      });
      
      // 处理错误输出
      this.serverProcess.stderr.on('data', (data) => {
        const text = data.toString();
        serverError += text;
        console.error(`\x1b[31m${text}\x1b[0m`);
      });
      
      // 处理进程退出
      this.serverProcess.on('close', (code) => {
        if (code !== 0) {
          this.log(`开发服务器意外退出，退出码: ${code}`, 'error');
          if (serverError) {
            this.log(`错误信息: ${serverError}`, 'error');
          }
        } else {
          this.log('开发服务器已停止', 'info');
        }
      });
      
      // 处理进程错误
      this.serverProcess.on('error', (error) => {
        this.log(`启动开发服务器失败: ${error.message}`, 'error');
        throw error;
      });
      
      // 设置超时检查
      const timeout = setTimeout(() => {
        if (!serverReady) {
          this.log('服务器启动超时，可能存在配置问题', 'error');
          this.stopDevServer();
        }
      }, 30000); // 30秒超时
      
      // 监听服务器准备就绪
      const readyCheck = setInterval(() => {
        if (serverReady) {
          clearInterval(readyCheck);
          clearTimeout(timeout);
          
          // 设置优雅退出处理
          this.setupGracefulShutdown();
        }
      }, 1000);
      
      return {
        success: true,
        localURL,
        networkURL,
        port: availablePort,
        host
      };
      
    } catch (error) {
      this.log(`启动开发服务器失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 停止开发服务器
   */
  stopDevServer() {
    if (this.serverProcess) {
      this.log('正在停止开发服务器...', 'info');
      this.serverProcess.kill('SIGTERM');
      this.serverProcess = null;
    }
  }

  /**
   * 设置优雅退出处理
   */
  setupGracefulShutdown() {
    const shutdown = () => {
      this.log('\n正在关闭服务器...', 'info');
      this.stopDevServer();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    // Windows特有处理
    if (process.platform === 'win32') {
      process.on('SIGBREAK', shutdown);
    }
  }

  /**
   * 重启开发服务器
   */
  async restartDevServer(options = {}) {
    this.log('正在重启开发服务器...', 'info');
    this.stopDevServer();
    
    // 等待进程完全停止
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return await this.startDevServer(options);
  }
}

module.exports = DevServerStarter;