#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 环境检测模块
 * 检测Node.js版本、npm环境、项目结构等
 */
class EnvironmentChecker {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    this.packageLockPath = path.join(this.projectRoot, 'package-lock.json');
  }

  /**
   * 检查Node.js版本
   */
  checkNodeVersion() {
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      // 检查是否满足最低版本要求
      const minVersion = 14;
      if (majorVersion < minVersion) {
        return {
          success: false,
          message: `Node.js版本过低: ${nodeVersion}，需要v${minVersion}或更高版本`,
          version: nodeVersion
        };
      }
      
      return {
        success: true,
        message: `Node.js版本检查通过: ${nodeVersion}`,
        version: nodeVersion
      };
    } catch (error) {
      return {
        success: false,
        message: `无法获取Node.js版本: ${error.message}`,
        version: null
      };
    }
  }

  /**
   * 检查npm是否可用
   */
  checkNpm() {
    try {
      execSync('npm --version', { stdio: 'ignore' });
      return {
        success: true,
        message: 'npm环境检查通过'
      };
    } catch (error) {
      return {
        success: false,
        message: `npm不可用: ${error.message}`
      };
    }
  }

  /**
   * 检查项目结构
   */
  checkProjectStructure() {
    const requiredFiles = [
      { name: 'package.json', path: this.packageJsonPath },
      { name: 'index.html', path: path.join(this.projectRoot, 'index.html') },
      { name: 'vite.config.ts', path: path.join(this.projectRoot, 'vite.config.ts') }
    ];

    const missingFiles = [];
    for (const file of requiredFiles) {
      if (!fs.existsSync(file.path)) {
        missingFiles.push(file.name);
      }
    }

    if (missingFiles.length > 0) {
      return {
        success: false,
        message: `缺少必要文件: ${missingFiles.join(', ')}`,
        missingFiles
      };
    }

    return {
      success: true,
      message: '项目结构检查通过'
    };
  }

  /**
   * 检查依赖是否已安装
   */
  checkDependencies() {
    // 检查node_modules目录是否存在
    if (!fs.existsSync(this.nodeModulesPath)) {
      return {
        installed: false,
        message: 'node_modules目录不存在，需要安装依赖',
        outdated: false
      };
    }

    // 检查package-lock.json是否存在
    if (!fs.existsSync(this.packageLockPath)) {
      return {
        installed: false,
        message: 'package-lock.json不存在，需要初始化项目',
        outdated: false
      };
    }

    // 检查依赖是否是最新的（简单检查）
    try {
      const packageJson = require(this.packageJsonPath);
      const packageLock = require(this.packageLockPath);
      
      // 检查主要依赖是否匹配
      const mainDeps = Object.keys(packageJson.dependencies || {});
      const lockDeps = Object.keys(packageLock.dependencies || {});
      
      const missingDeps = mainDeps.filter(dep => !lockDeps.includes(dep));
      
      if (missingDeps.length > 0) {
        return {
          installed: true,
          outdated: true,
          message: `部分依赖缺失或过时: ${missingDeps.join(', ')}，需要更新依赖`,
          missingDeps
        };
      }
      
      return {
        installed: true,
        outdated: false,
        message: '依赖检查通过，所有依赖已正确安装'
      };
    } catch (error) {
      return {
        installed: true,
        outdated: true,
        message: `依赖检查出错，建议重新安装: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * 检查网络连接
   */
  checkNetworkConnection() {
    return new Promise((resolve) => {
      try {
        // 简单的网络检查，尝试连接npm registry
        execSync('npm ping', { stdio: 'ignore', timeout: 5000 });
        resolve({
          success: true,
          message: '网络连接正常'
        });
      } catch (error) {
        resolve({
          success: false,
          message: '网络连接失败，可能影响依赖安装'
        });
      }
    });
  }

  /**
   * 执行完整的环境检查
   */
  async runFullCheck() {
    const results = {
      nodeVersion: this.checkNodeVersion(),
      npm: this.checkNpm(),
      projectStructure: this.checkProjectStructure(),
      dependencies: this.checkDependencies(),
      network: await this.checkNetworkConnection()
    };

    // 检查是否有任何关键错误
    const criticalErrors = [];
    
    if (!results.nodeVersion.success) {
      criticalErrors.push(results.nodeVersion.message);
    }
    
    if (!results.npm.success) {
      criticalErrors.push(results.npm.message);
    }
    
    if (!results.projectStructure.success) {
      criticalErrors.push(results.projectStructure.message);
    }

    const overallSuccess = criticalErrors.length === 0;
    
    return {
      success: overallSuccess,
      results,
      criticalErrors,
      message: overallSuccess 
        ? '环境检查通过，可以启动项目' 
        : '环境检查失败，请解决以下问题后再启动'
    };
  }
}

module.exports = EnvironmentChecker;