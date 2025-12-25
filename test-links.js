// 测试链接功能的简单脚本
const fs = require('fs');
const path = require('path');

// 检查HTML文件是否存在
const checkFiles = () => {
  const parentDir = path.join(__dirname, '..');
  const htmlFiles = [
    '成绩分析.html',
    '古诗检测.html', 
    '早读检测仪.html',
    '静学智能哨兵.html',
    '星励成长积分系统.html',
    '水果单词消消乐.html'
  ];

  console.log('检查HTML文件是否存在：');
  htmlFiles.forEach(file => {
    const filePath = path.join(parentDir, file);
    const exists = fs.existsSync(filePath);
    console.log(`${file}: ${exists ? '✓ 存在' : '✗ 不存在'}`);
  });
};

checkFiles();