/**
 * Gitee Pages 静态构建：临时移除 API 路由，使用静态导出配置执行 next build
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'src', 'app', 'api');
const apiBak = path.join(root, '.api_bak');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) rmDir(p);
    else fs.unlinkSync(p);
  }
  fs.rmdirSync(dir);
}

if (fs.existsSync(apiDir)) {
  copyDir(apiDir, apiBak);
  rmDir(apiDir);
  console.log('已临时移除 API 路由');
}

try {
  execSync('npm run build', {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, GITEE_DEPLOY: '1' },
  });
} finally {
  if (fs.existsSync(apiBak)) {
    copyDir(apiBak, apiDir);
    rmDir(apiBak);
    console.log('已恢复 API 路由');
  }
}
