/**
 * 构建并准备 Gitee Pages 部署：将 out 内容复制到 deploy 目录
 * 用法：npm run build:gitee && node scripts/deploy-gitee.js
 * 然后 cd deploy && git init && git add . && git commit -m "deploy" && git push ...
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out');
const deployDir = path.join(root, 'deploy');

if (!fs.existsSync(outDir)) {
  console.error('请先执行 npm run build:gitee');
  process.exit(1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(deployDir, { recursive: true, force: true });
copyDir(outDir, deployDir);
console.log('已复制 out/ 到 deploy/，可将 deploy 目录推送到 Gitee Pages 分支');
console.log('示例：cd deploy && git init && git add . && git commit -m "deploy" && git remote add gitee <url> && git push -f gitee main');
