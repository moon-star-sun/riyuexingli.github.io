#!/usr/bin/env node

const path = require('path');
const EnvironmentChecker = require('./env-checker');
const DependencyInstaller = require('./dep-installer');
const DevServerStarter = require('./dev-starter');

/**
 * 星励智学平台自动启动器
 * 协调环境检查、依赖安装和服务器启动
 */
class AutoStarter {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.envChecker = new EnvironmentChecker();
    this.depInstaller = new DependencyInstaller();
    this.devStarter = new DevServerStarter();
    this.startTime = Date.now();
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
   * 显示欢迎信息
   */
  showWelcome() {
    console.clear();
    console.log('\x1b[35m' + 
    '=================================================\n' +
    '              星励智学平台启动器                  \n' +
    '=================================================\n' +
    '\x1b[0m');
    console.log('\x1b[32m🚀 正在启动星励智学平台...\x1b[0m\n');
  }

  /**
   * 显示启动完成信息
   */
  showCompletion(serverInfo) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log('\n\x1b[35m' + 
    '=================================================\n' +
    '              星励智学平台已启动!                  \n' +
    '=================================================\n' +
    '\x1b[0m');
    
    console.log(`\x1b[32m⏱️ 启动耗时: ${duration}秒\x1b[0m\n`);
    console.log('\x1b[36m🌐 访问地址:\x1b[0m');
    console.log(`   本地: \x1b[36m${serverInfo.localURL}\x1b[0m`);
    console.log(`   网络: \x1b[36m${serverInfo.networkURL}\x1b[0m\n`);
    console.log('\x1b[32m📝 使用 Ctrl+C 可以停止服务器\x1b[0m\n');
  }

  /**
   * 环境检查阶段
   */
  async checkEnvironment() {
    this.log('【阶段 1/4】环境检查', 'info');
    
    try {
      const envCheck = await this.envChecker.runFullCheck();
      
      if (!envCheck.success) {
        this.log('环境检查失败!', 'error');
        for (const error of envCheck.criticalErrors) {
          console.log(`  \x1b[31m• ${error}\x1b[0m`);
        }
        throw new Error('环境不满足启动要求');
      }
      
      this.log('环境检查通过', 'success');
      
      // 显示环境信息
      const results = envCheck.results;
      console.log(`  • Node.js版本: ${results.nodeVersion.version}`);
      console.log(`  • npm状态: 可用`);
      console.log(`  • 项目结构: 完整`);
      console.log(`  • 依赖状态: ${results.dependencies.installed ? '已安装' : '未安装'}`);
      
      return envCheck;
    } catch (error) {
      this.log(`环境检查出错: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 依赖管理阶段
   */
  async manageDependencies() {
    this.log('\n【阶段 2/4】依赖管理', 'info');
    
    try {
      const depResult = await this.depInstaller.ensureDependencies();
      this.log('依赖管理完成', 'success');
      return depResult;
    } catch (error) {
      this.log(`依赖管理失败: ${error.message}`, 'error');
      this.log('\n请尝试手动解决以下问题:', 'warning');
      console.log('  1. 检查网络连接是否正常');
      console.log('  2. 清理npm缓存: npm cache clean --force');
      console.log('  3. 删除node_modules后重新安装');
      
      throw error;
    }
  }

  /**
   * 服务器启动阶段
   */
  async startServer(options = {}) {
    this.log('\n【阶段 3/4】启动开发服务器', 'info');
    
    try {
      const serverInfo = await this.devStarter.startDevServer({
        port: options.port,
        host: options.host || '0.0.0.0',
        open: options.open !== false,
        clearConsole: false
      });
      
      return serverInfo;
    } catch (error) {
      this.log(`服务器启动失败: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * 用户交互阶段
   */
  async handleUserInteraction(serverInfo) {
    this.log('\n【阶段 4/4】用户界面', 'info');
    
    // 显示完成信息
    this.showCompletion(serverInfo);
    
    // 添加一些有用的提示
    console.log('\x1b[33m💡 提示:\x1b[0m');
    console.log('  • 服务器将自动检测文件变化并热重载');
    console.log('  • 如需查看控制台输出，请保持此终端窗口打开');
    console.log('  • 编辑代码后，浏览器会自动刷新显示最新内容');
  }

  /**
   * 错误处理
   */
  handleError(error) {
    console.log('\n\x1b[31m' + 
    '=================================================\n' +
    '               启动过程中发生错误                 \n' +
    '=================================================\n' +
    '\x1b[0m');
    
    this.log(`错误: ${error.message}`, 'error');
    
    console.log('\n\x1b[33m🔧 故障排除建议:\x1b[0m');
    console.log('  1. 确保已安装Node.js 14+版本');
    console.log('  2. 检查网络连接是否正常');
    console.log('  3. 尝试手动删除node_modules文件夹后重新启动');
    console.log('  4. 如果问题持续存在，请联系技术支持');
    
    process.exit(1);
  }

  /**
   * 主启动流程
   */
  async start(options = {}) {
    try {
      // 显示欢迎信息
      this.showWelcome();
      
      // 阶段1: 环境检查
      const envResult = await this.checkEnvironment();
      
      // 阶段2: 依赖管理
      const depResult = await this.manageDependencies();
      
      // 阶段3: 启动服务器
      const serverInfo = await this.startServer(options);
      
      // 阶段4: 用户交互
      await this.handleUserInteraction(serverInfo);
      
      // 返回启动结果
      return {
        success: true,
        envResult,
        depResult,
        serverInfo,
        startTime: this.startTime,
        endTime: Date.now()
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        error: error.message,
        startTime: this.startTime,
        endTime: Date.now()
      };
    }
  }

  /**
   * 仅检查环境，不启动服务器
   */
  async checkOnly() {
    try {
      this.showWelcome();
      return await this.checkEnvironment();
    } catch (error) {
      this.handleError(error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 仅安装依赖，不启动服务器
   */
  async installOnly() {
    try {
      this.showWelcome();
      await this.checkEnvironment();
      return await this.manageDependencies();
    } catch (error) {
      this.handleError(error);
      return { success: false, error: error.message };
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const autoStarter = new AutoStarter();
  
  // 解析命令行参数
  const args = process.argv.slice(2);
  const options = {};
  
  // 处理命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--port' && i + 1 < args.length) {
      options.port = parseInt(args[i + 1]);
      i++;
    } else if (arg === '--host' && i + 1 < args.length) {
      options.host = args[i + 1];
      i++;
    } else if (arg === '--no-open') {
      options.open = false;
    } else if (arg === '--check-only') {
      autoStarter.checkOnly();
      process.exit(0);
    } else if (arg === '--install-only') {
      autoStarter.installOnly();
      process.exit(0);
    } else if (arg === '--help') {
      console.log(`
星励智学平台启动器

用法:
  node auto-start.js [选项]

选项:
  --port <端口号>     指定服务器端口 (默认: 5173)
  --host <主机名>     指定服务器主机 (默认: 0.0.0.0)
  --no-open          禁止自动打开浏览器
  --check-only       仅检查环境，不启动服务器
  --install-only     仅安装依赖，不启动服务器
  --help             显示帮助信息

示例:
  node auto-start.js
  node auto-start.js --port 3000
  node auto-start.js --host 127.0.0.1 --no-open
  node auto-start.js --check-only
      `);
      process.exit(0);
    }
  }
  
  // 启动应用
  autoStarter.start(options);
}

module.exports = AutoStarter;