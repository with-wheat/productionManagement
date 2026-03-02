/**
 * 将 data/questions.json 复制到 public/questions.json，供静态部署使用
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'data', 'questions.json');
const destDir = path.join(root, 'public');
const dest = path.join(destDir, 'questions.json');

fs.mkdirSync(destDir, { recursive: true });
try {
  fs.copyFileSync(src, dest);
  console.log('已复制 questions.json 到 public/');
} catch (e) {
  fs.writeFileSync(dest, '[]', 'utf-8');
  console.log('data/questions.json 不存在，已创建空题库 public/questions.json');
}
