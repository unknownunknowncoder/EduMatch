const fs = require('fs');
const path = require('path');

// 创建 scripts 目录（如果不存在）
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// 确保 dist 目录存在
const distDir = path.join(scriptsDir, '..', 'dist');
const functionsDir = path.join(distDir, 'functions');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

// 复制 functions 目录
const sourceDir = path.join(scriptsDir, '..', 'netlify', 'functions');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source directory does not exist: ${src}`);
    return;
  }
  
  const exists = fs.existsSync(dest);
  const stats = exists && fs.statSync(dest);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  
  fs.mkdirSync(dest, { recursive: true });
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    const itemStats = fs.statSync(srcPath);
    
    if (itemStats.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyRecursive(sourceDir, functionsDir);
  console.log('✅ Successfully copied Netlify Functions to dist/functions');
} catch (error) {
  console.error('❌ Error copying functions:', error);
  process.exit(1);
}