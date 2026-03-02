# 刷题网站

基于 Next.js 14 的刷题系统，支持 Excel 导入、随机顺序刷题（每题仅出现一次）、即时反馈与错题回顾，可部署至 Vercel。

## 功能

- **用户端**：首页进入刷题 → 题目随机顺序、每题只出现一次 → 选答后即时显示对错 → 进度与结果统计、错题列表
- **管理端**：Excel 上传解析、题库列表、删除题目；题目持久化存储（JSON 文件）

## 技术栈

- Next.js 14（App Router）、React 18、TypeScript
- Tailwind CSS
- xlsx 解析 Excel
- Fisher-Yates 洗牌保证随机且不重复

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 用 Excel 文件生成题库（本地）

若已有 Excel 题目文件，可在本地一次性导入为 `data/questions.json`（便于提交到 Git 后在 Vercel 使用）：

```bash
npm run import-excel "你的Excel路径.xlsx"
# 例如：npm run import-excel "C:\Users\xxx\Downloads\副本机械类专职安全生产管理人员(C1).xlsx"
```

## Excel 格式要求

- 格式：`.xlsx`
- 表头需包含：
  - **题干**：列名可为「题干」「题目」「题目内容」
  - **选项**：列名可为「A」「B」「C」「D」或「选项A」等
  - **答案**：列名可为「答案」「正确答案」「正确选项」，值为 A/B/C/D 或 1/2/3/4
- 单文件建议不超过 5MB

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "init quiz site"
# 在 GitHub 新建仓库后：
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 绑定仓库

1. 打开 [vercel.com](https://vercel.com)，登录（可选 GitHub 登录）
2. 点击 **Add New** → **Project**
3. 选择刚推送的 GitHub 仓库，**Import**
4. 保持默认（Framework: Next.js），点击 **Deploy**
5. 部署完成后会得到公开访问链接，例如 `https://xxx.vercel.app`

### 3. 持久化说明（重要）

- Vercel 为无状态环境，**运行时不支持写入项目目录**。
- **推荐做法**：在本地通过「题库管理」上传 Excel 导入题目后，将 `data/questions.json` 一并提交到 Git，部署后站点以只读方式使用该题库。
- 若需在**线上**继续导入/编辑题目，需要接入可写存储（如 Vercel Postgres、Vercel Blob 或其它数据库），并修改 `src/lib/questions.ts` 的读写逻辑。

## 项目结构

```
src/
  app/
    page.tsx          # 首页
    quiz/page.tsx     # 刷题页
    result/page.tsx  # 结果页
    admin/page.tsx    # 题库管理
    api/
      questions/      # 题目 CRUD
      upload/         # Excel 上传解析
  lib/
    shuffle.ts        # Fisher-Yates 洗牌
    questions.ts      # 题目读写
    excelParser.ts    # Excel 解析与校验
  types/
    question.ts       # 题型定义
data/
  questions.json      # 题目存储（可提交到 Git 供 Vercel 只读）
```

## 环境变量

当前无必须环境变量。若后续接入数据库，可在 Vercel 项目 **Settings → Environment Variables** 中配置。
